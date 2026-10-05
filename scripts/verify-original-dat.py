"""Read only: verify every DAT selection branch against the original EXE.
Usage: python scripts/verify-original-dat.py /path/to/tipologia.exe
No execution, database credentials or user records are needed.
"""
import hashlib
import json
from pathlib import Path
import struct
import sys

binary = Path(sys.argv[1]).read_bytes()
fixture = json.loads((Path(__file__).resolve().parents[1] / 'tests/fixtures/original-marker-data.json').read_text())
assert hashlib.sha256(binary).hexdigest() == fixture['sourceHashes']['tipologia.exe'], 'Unexpected executable version'
pe = struct.unpack_from('<I', binary, 60)[0]
count = struct.unpack_from('<H', binary, pe + 6)[0]
optional_size = struct.unpack_from('<H', binary, pe + 20)[0]
base = struct.unpack_from('<I', binary, pe + 52)[0]
sections = []
for index in range(count):
    pos = pe + 24 + optional_size + 40 * index
    virtual_size, address, raw_size, raw_offset = struct.unpack_from('<IIII', binary, pos + 8)
    sections.append((address, max(virtual_size, raw_size), raw_offset))

def offset(address):
    for start, size, raw in sections:
        if start <= address - base < start + size:
            return address - base - start + raw
    raise ValueError(f'Unmapped address {address:#x}')

def u32(address):
    return struct.unpack_from('<I', binary, offset(address))[0]

def delphi_string(address):
    size = u32(address - 4)
    assert size == 3
    return binary[offset(address):offset(address) + size].decode('ascii')

for outer, width, name in [(0x53237f, 6, 'physicalEmotional'), (0x53284f, 8, 'physicalIntellectual')]:
    result = []
    for physical in range(1, 8):
        branch = u32(outer + physical * 4)
        code = binary[offset(branch):offset(branch) + 40]
        jump = code.index(b'\xff\x24\x85')
        inner = struct.unpack_from('<I', code, jump + 3)[0]
        row = []
        for group in range(1, width + 1):
            target = u32(inner + group * 4)
            assert binary[offset(target)] == 0xb8 and binary[offset(target) + 5] == 0xba
            row.append(delphi_string(u32(target + 6)))
        result.append(row)
    assert result == fixture[name], f'{name} differs from original executable'
    print(f'{name}: all {7 * width} branches match')
