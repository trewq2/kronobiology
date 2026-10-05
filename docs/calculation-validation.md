# Az eredeti programból átvett szabályok – 2026.10.05.

## Közvetlen források és módszer

A felhasználó eredeti `Tipologia` csomagjának `tipologia.exe` fájlját statikusan
vizsgáltuk; nem futtattuk. Az `ADATOK/BAZIS.abs` Absolute Database v5 adatbázisát
csak olvasásra nyitottuk meg a `github.com/cwbudde/go-absolute-database@v0.1.2`
MIT-licencű olvasóval. A program beépített adatbázis-beállítását csak memóriában
használtuk; a repó nem tartalmaz hozzáférési adatot, EXE-t vagy teljes adatbázist.
Csak a MARKERS és BAZIS_ táblákat exportáltuk; más táblát nem olvastunk ki.

A `tests/fixtures/original-marker-data.json` tartalmazza a 33 MARKERS rekordot,
az EXE két döntési tábláját és mindkét eredeti fájl SHA-256 azonosítóját.
A nyers szövegmezőkben az olvasó Windows-1252 dekódolása miatt õ/û szerepelhet;
a kódok és számpárok ASCII-adatok. A kliens magyar típusnevei helyes Unicode
karakterekkel szerepelnek. A `scripts/verify-original-dat.py` közvetlenül,
csak olvasással újraellenőrzi az EXE mind a 98 döntési ágát a fixture ellen.

## A DAT-választás pontos működése

A program a dátum alapján a BAZIS_ rekordból olvassa M1/M2/M3 értékét
(`0x533c4d`–`0x533d58`). A MARKERS táblában az M markerhez tartozó
S11/S21/S31 mezők adják a fizikai, érzelmi és intellektuális csoportot
(`0x533ede`, `0x5341b5`, `0x53448c`). Ezek nem a DAT-fájlnév számjegyei.

A `0x532318` eljárás döntési táblái:

- Fizikai–érzelmi: 7 × 6 ág, külső ugrótábla `0x53237f`.
- Fizikai–intellektuális: 7 × 8 ág, külső ugrótábla `0x53284f`.
- Az intellektuális 3-as és 4-es csoport ugyanahhoz a fájlhoz vezet.
- Összesen 91 különböző DAT-szöveg.

Az `originalAnalysisRules.ts` ezeket a kinyert kódokat és döntési táblákat
közvetlenül tartalmazza. A `datAnalyses.ts` már nem becsüli a csoportokat a
típusnévből, és nem képernyőképenként módosított listát használ.
Mind a 23 × 28 × 33 = 21 252 markerhármas kimenetét a független fixture
ellen teszteljük. A korábbi kliens 9 988 hármasnál legalább egy eltérő
fájlt választott; ez nem az érintett születési dátumok száma.

## Az eredeti dátumeredmények reprodukálása – felhasználói pontosítás

A 2026.10.05-én csatolt három képkivágás egyértelművé teszi az elfogadási
feltételt: ugyanarra a dátumra az eredeti program kimenetét kell visszaadni.
Az előző változat hibás termékdöntése az volt, hogy a PDF-táblák szerinti
naptárt tartotta meg, miközben csak a DAT-választást vette át az EXE-ből.
Így a szökőévi januári–februári dátumok eltértek a felhasználó programjától.

A BAZIS_ 80 719 egyedi rekordja (1800.01.01–2020.12.31.) alapján az eredeti
program naptára tömören, teljes egyezéssel leírható:

- A napi/éves PDF alapképletével 77 479 dátum egyezik.
- Szökőév januárjában a következő naptári nap PDF-markerei szerepelnek
  az adatbázisban (1 674 rekord).
- Szökőév februárjában a 29 nappal korábbi nap PDF-markerei szerepelnek
  az adatbázisban (1 566 rekord).
- A 1800-as és 1900-as év nem szökőév, a 2000-es év szökőév.

A termék most ezt az eredeti adatbázissal egyező szabályt használja.
A bemeneti dátum és annak validálása változatlan; a kompatibilitási eltolás
kizárólag a marker kiválasztására hat. Nincs egyedi dátumra írt javítás.
Az adatbázist előállító régi generátorkód nem ismert; a fenti szabály a
kinyert teljes adatállomány ellenőrzött, tömör reprezentációja.

A PDF-alapképlet külön `calculateTableMarkers` függvényben marad meg az
ellenőrzésekhez. A felület a `calculateChronobiology` eredeti programmal
egyező kimenetét használja. A két eltérő forrást nem keverjük a kimenetben.

## A három új képkivágás regressziós referenciája

Források: `image(20261005-130544).png`, `image(20261005-130558).png`,
`image(20261005-130624).png`. Dátum: **2000.01.01.**

| Érték | Eredeti program és webes változat |
| --- | --- |
| Markerek | 2 / 4 / 24 |
| Fizikai jobb / bal | 55 / 72 |
| Érzelmi jobb / bal | 62 / 77 |
| Intellektuális jobb / bal | 26 / 18 |
| Jobb / bal agyfélteke | 143 / 167 |
| Test jobb / bal oldala | 167 / 143 |
| Összpontszám | 310 |
| Jin / Jang | 211 / 99 |
| DAT-fájlok | 113.dat / 273.dat |

A teszt a két megjelenő szöveg tartalmát is ellenőrzi. A forrás DAT-fájl
„Agresszívitás” írásmódját változatlanul őrizzük.

További, közvetlen BAZIS_ referenciák:

| Dátum | Markerek | Összpontszám | DAT-fájlok |
| --- | --- | ---: | --- |
| 1996.01.01. | 14 / 9 / 33 | 321 | 124 / 244 |
| 2000.01.02. | 1 / 3 / 23 | 281 | 155 / 235 |
| 2000.02.29. | 19 / 3 / 28 | 288 | 152 / 272 |
| 2004.01.01. | 13 / 27 / 15 | 373 | 115 / 215 |
| 1988.01.30. | 9 / 18 / 22 | 157 | 167 / 217 |

## Profilok, forráselsőbbség és tesztek

Mind a 84 számpár a MARKERS J1/J2/J3 adatbázismezőivel egyezik.
A korábbi, Excelből átvett fizikai 7-es 45/75 felülírás megszűnt;
az eredeti program 45/72 értékét használjuk. Például 1991.03.05.
összpontszáma emiatt 398 helyett az eredeti 395. Az Excel eltéréseit
nem alkalmazzuk automatikusan az eredeti kimenetre.

A `kronobiologia.original.test.ts` a függetlenül kinyert fixture-adatokból,
a termék dátumképlete és profiljai nélkül állítja elő az elvárt kimenetet.
Mind a 80 719 dátumnál összehasonlítja a markereket, a hat értéket, az
agyfélteke- és testösszegeket, az összpontszámot, a Jin/Jang értékeket,
valamint a két DAT-fájl nevét. Eltérés: **0**.

Továbbra is ellenőrizzük mind a 21 252 markerhármas DAT-választását,
a 91 szöveg meglétét és a korábbi képi referenciákat. A külön PDF-alapképletet
18 262 napi sor és 221 év végi alapérték ellen teszteljük; ezek nem az
alapértelmezett termékeredmény elvárásai. A teljes tesztcsomag 83 tesztből áll.

## Publikálás

A változat előnézetre készül. GitHub-frissítés csak az új változat
felhasználói jóváhagyása után történhet.
