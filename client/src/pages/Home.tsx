// Digitális műszerfal irány: aszimmetrikus, világos adatlelet, fekete szerkesztői vonalak,
// mély indigó márkaszín és következetes kék–zöld–piros szintkód.

import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, CircleHelp, FileText, Printer, RotateCcw, Sparkles } from "lucide-react";
import {
  calculateChronobiology,
  formatDate,
  validateBirthDate,
  type ChronobiologyResult,
  type LevelKey,
  type LevelResult,
} from "@/lib/kronobiologia";
import { getDatAnalyses } from "@/lib/datAnalyses";

const orbitBackground = "/manus-storage/kronobiologia-orbit-bg_7e5e1ac8.png";
const contourBackground = "/manus-storage/kronobiologia-contour-bg_bfb36759.png";
const gridBackground = "/manus-storage/kronobiologia-grid-bg_9ac53615.png";
const logoAsset = "/manus-storage/kronobiologia-mark_a0b7cc0c.png";

const levelStyles: Record<LevelKey, { text: string; bg: string; line: string; soft: string }> = {
  intellectual: { text: "text-[#283A8A]", bg: "bg-[#E6EBFF]", line: "bg-[#283A8A]", soft: "bg-[#F1F3FF]" },
  emotional: { text: "text-[#218C7A]", bg: "bg-[#E2F1EA]", line: "bg-[#218C7A]", soft: "bg-[#F0F8F3]" },
  physical: { text: "text-[#D94B4B]", bg: "bg-[#FBE5E2]", line: "bg-[#D94B4B]", soft: "bg-[#FFF4F2]" },
};

function MetricTag({ value, level }: { value: number; level: LevelKey }) {
  const style = levelStyles[level];
  return <span className={`metric-tag ${style.text} ${style.bg}`}>{String(value).padStart(2, "0")}</span>;
}

function LevelPill({ level }: { level: LevelResult }) {
  const style = levelStyles[level.key];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${style.soft} ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.line}`} />
      {level.label}
    </span>
  );
}

function ContourDiagram({ result }: { result: ChronobiologyResult }) {
  const intellectual = result.levels.find((level) => level.key === "intellectual")!;
  const emotional = result.levels.find((level) => level.key === "emotional")!;
  const physical = result.levels.find((level) => level.key === "physical")!;
  return (
    <div className="diagram-card contour-card">
      <div className="diagram-heading">
        <div><p className="eyebrow">03 / kontúr</p><h3>Agyfélteke- és testkontúr</h3></div>
        <CircleHelp size={18} strokeWidth={1.5} />
      </div>
      <div className="contour-visual contour-classic">
        <svg viewBox="0 0 520 540" role="img" aria-label="Eredeti program szerinti agyfélteke- és testkontúr">
          <defs>
            <marker id="contour-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#111" /></marker>
          </defs>
          <path d="M190 28 C145 35 130 105 151 151 C162 174 178 190 210 214 C218 220 218 230 210 240" className="classic-contour" />
          <path d="M330 28 C375 35 390 105 369 151 C358 174 342 190 310 214 C302 220 302 230 310 240" className="classic-contour" />
          <path d="M210 24 Q260 4 310 24 M210 24 L210 214 M310 24 L310 214" className="classic-contour" />
          <line x1="154" y1="82" x2="366" y2="82" className="classic-divider" />
          <line x1="154" y1="140" x2="366" y2="140" className="classic-divider" />
          <line x1="154" y1="198" x2="366" y2="198" className="classic-divider" />
          <text x="230" y="70" className="classic-blue">{String(intellectual.right).padStart(2, "0")}</text><text x="290" y="70" className="classic-blue">{String(intellectual.left).padStart(2, "0")}</text>
          <text x="230" y="128" className="classic-green">{String(emotional.right).padStart(2, "0")}</text><text x="290" y="128" className="classic-green">{String(emotional.left).padStart(2, "0")}</text>
          <text x="230" y="186" className="classic-red">{String(physical.right).padStart(2, "0")}</text><text x="290" y="186" className="classic-red">{String(physical.left).padStart(2, "0")}</text>
          <path d="M155 45 C128 92 132 145 166 188" className="classic-arrow" markerEnd="url(#contour-arrow)" /><path d="M365 45 C392 92 388 145 354 188" className="classic-arrow" markerEnd="url(#contour-arrow)" />
          <rect x="36" y="84" width="82" height="36" className="sum-box" /><text x="77" y="108" textAnchor="middle" className="sum-text">{result.rightBrain}</text><text x="78" y="72" textAnchor="middle" className="side-label">Jobb</text><text x="78" y="84" textAnchor="middle" className="side-label">agyfélteke</text>
          <rect x="402" y="84" width="82" height="36" className="sum-box" /><text x="443" y="108" textAnchor="middle" className="sum-text">{result.leftBrain}</text><text x="442" y="72" textAnchor="middle" className="side-label">Bal</text><text x="442" y="84" textAnchor="middle" className="side-label">agyfélteke</text>
          <path d="M210 214 C170 250 125 268 125 365 C125 458 185 500 260 500 C335 500 395 458 395 365 C395 268 350 250 310 214" className="classic-contour" />
          <path d="M196 235 C155 275 145 315 145 370 C145 438 190 468 260 480 C330 468 375 438 375 370 C375 315 365 275 324 235" className="classic-inner" />
          <text x="260" y="272" textAnchor="middle" className="classic-green">{String(emotional.left).padStart(2, "0")}</text><text x="260" y="338" textAnchor="middle" className="classic-green">{String(emotional.right).padStart(2, "0")}</text><text x="260" y="404" textAnchor="middle" className="classic-red">{String(physical.left).padStart(2, "0")}</text><text x="260" y="462" textAnchor="middle" className="classic-red">{String(physical.right).padStart(2, "0")}</text>
          <path d="M172 250 C120 300 120 410 166 448" className="classic-arrow" markerEnd="url(#contour-arrow)" /><path d="M348 250 C400 300 400 410 354 448" className="classic-arrow" markerEnd="url(#contour-arrow)" />
          <rect x="24" y="360" width="82" height="36" className="sum-box" /><text x="65" y="384" textAnchor="middle" className="sum-text">{result.leftBrain}</text><text x="65" y="414" textAnchor="middle" className="side-label">a test</text><text x="65" y="428" textAnchor="middle" className="side-label">jobb oldala</text>
          <rect x="414" y="360" width="82" height="36" className="sum-box" /><text x="455" y="384" textAnchor="middle" className="sum-text">{result.rightBrain}</text><text x="455" y="414" textAnchor="middle" className="side-label">a test</text><text x="455" y="428" textAnchor="middle" className="side-label">bal oldala</text>
          <text x="260" y="530" textAnchor="middle" className="total-text">{result.total}</text>
        </svg>
      </div>
    </div>
  );
}

function TriangleDiagram({ result }: { result: ChronobiologyResult }) {
  const intellectual = result.levels.find((level) => level.key === "intellectual")!;
  const emotional = result.levels.find((level) => level.key === "emotional")!;
  const physical = result.levels.find((level) => level.key === "physical")!;
  return (
    <div className="diagram-card triangle-card">
      <div className="diagram-heading">
        <div>
          <p className="eyebrow">04 / egyensúly</p>
          <h3>Jin–Jang összkép</h3>
        </div>
        <Sparkles size={18} strokeWidth={1.5} />
      </div>
      <div className="triangle-visual">
        <img src={gridBackground} alt="Finom mérőrács" />
        <svg viewBox="0 0 420 400" role="img" aria-label="Tipológiai Jin–Jang összkép">
          <path d="M210 20 L350 300 H70 Z" className="triangle-outline" />
          <path d="M70 100 H170 L120 200 Z M250 100 H350 L300 200 Z M170 300 H250 L210 390 Z" className="triangle-side" />
          <line x1="145" y1="198" x2="275" y2="198" className="triangle-divider" />
          <text x="210" y="86" textAnchor="middle" className="svg-red">{String(physical.left).padStart(2, "0")}</text>
          <text x="122" y="158" textAnchor="middle" className="svg-blue">{String(intellectual.right).padStart(2, "0")}</text>
          <text x="298" y="158" textAnchor="middle" className="svg-blue">{String(intellectual.left).padStart(2, "0")}</text>
          <text x="154" y="275" textAnchor="middle" className="svg-green">{String(emotional.right).padStart(2, "0")}</text>
          <text x="266" y="275" textAnchor="middle" className="svg-green">{String(emotional.left).padStart(2, "0")}</text>
          <text x="210" y="355" textAnchor="middle" className="svg-red">{String(physical.right).padStart(2, "0")}</text>
          <text x="165" y="190" textAnchor="end" className="svg-caption">Jin:</text>
          <text x="225" y="190" textAnchor="middle" className="svg-caption-value">{result.jin}</text>
          <text x="165" y="224" textAnchor="end" className="svg-caption">Jang:</text>
          <text x="225" y="224" textAnchor="middle" className="svg-caption-value">{result.jang}</text>
        </svg>
      </div>
      <div className="triangle-note">Jin: {result.jin} · Jang: {result.jang}. A háromszög a klasszikus program szerinti összképet mutatja.</div>
    </div>
  );
}

function MatrixCard({ result }: { result: ChronobiologyResult }) {
  return (
    <section className="matrix-shell">
      <div className="matrix-header">
        <div>
          <p className="eyebrow">02 / tipológiai mátrix</p>
          <h2>{result.name || "Névtelen vizsgálat"}</h2>
          <p className="muted-copy">Született: {formatDate(result.birthDate)}</p>
        </div>
        <div className="matrix-total">
          <span>Összes potenciál</span>
          <strong>{result.total}</strong>
        </div>
      </div>
      <div className="matrix-table" role="table" aria-label="Tipológiai marker mátrix">
        <div className="matrix-row matrix-row-head" role="row">
          <span>Marker</span><span>Jobb agyfélteke</span><span>Bal agyfélteke</span><span>Szint</span>
        </div>
        {result.levels.map((level) => (
          <div className="matrix-row" role="row" key={level.key}>
            <div className="marker-cell"><MetricTag value={level.marker} level={level.key} /><span>{level.label}</span></div>
            <div className="metric-cell"><strong>{String(level.right).padStart(2, "0")}</strong><span>{level.rightLabel}</span></div>
            <div className="metric-cell"><strong>{String(level.left).padStart(2, "0")}</strong><span>{level.leftLabel}</span></div>
            <div className="type-cell"><LevelPill level={level} /><span>{level.key === "physical" ? "temperamentum" : level.key === "emotional" ? "érzelem" : "intellektus"}</span></div>
          </div>
        ))}
        <div className="matrix-row matrix-row-total" role="row">
          <span>Összeg</span><strong>{result.rightBrain}</strong><strong>{result.leftBrain}</strong><span className="font-mono text-sm">{result.total} pont</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [name, setName] = useState("Varga Katalin");
  const [birthDate, setBirthDate] = useState("1973-04-10");
  const [result, setResult] = useState<ChronobiologyResult | null>(() => calculateChronobiology("Varga Katalin", "1973-04-10"));
  const [error, setError] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const dateMeta = useMemo(() => {
    if (!birthDate) return "ÉÉÉÉ.HH.NN";
    return formatDate(birthDate);
  }, [birthDate]);

  const handleCalculate = () => {
    const dateError = validateBirthDate(birthDate);
    if (!name.trim()) {
      setError("A név megadása szükséges.");
      return;
    }
    if (dateError) {
      setError(dateError);
      return;
    }
    setError("");
    setShowAnalysis(false);
    setResult(calculateChronobiology(name, birthDate));
  };

  const handleReset = () => {
    setName("");
    setBirthDate("");
    setResult(null);
    setError("");
    setShowAnalysis(false);
  };

  return (
    <main className="app-shell">
      <div className="background-orbit" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src={logoAsset} alt="" />
          <div><span className="brand-kicker">KRONO / 01</span><strong>Tipológia</strong></div>
        </div>
        <div className="topbar-note"><span className="live-dot" /> helyben számolva · nincs feltöltés</div>
      </header>

      <div className="app-grid">
        <section className="workspace">
          <div className="input-panel">
            <div className="input-panel-header"><div><span className="eyebrow">Személyi adatlap</span><h2>Kihez tartozik a tipológia?</h2></div><span className="input-code">KRB–{birthDate ? birthDate.slice(0, 4) : "0000"}</span></div>
            <div className="form-grid">
              <label className="field-wrap"><span>Név</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Például: Nagy Zsolt" autoComplete="name" /></label>
              <label className="field-wrap"><span>Születési dátum</span><div className="date-input-wrap"><CalendarDays size={18} /><input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} aria-describedby="date-help" /></div><small id="date-help">A forrástáblázat időtartománya: 1800–2020 · {dateMeta}</small></label>
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="form-actions"><button className="primary-action" onClick={handleCalculate}><span>Számítás</span><ChevronRight size={18} /></button><button className="quiet-action" onClick={handleReset}><RotateCcw size={16} /> új adatlap</button></div>
          </div>

          {result ? (
            <div className="results-stack">
              <MatrixCard result={result} />
              <div className="diagram-grid"><ContourDiagram result={result} /><TriangleDiagram result={result} /></div>
              <section className="result-actions"><div><span className="eyebrow">05 / kimenet</span><h3>A tipológia menthető és nyomtatható.</h3></div><div className="result-buttons"><button className="secondary-action" onClick={() => window.print()}><Printer size={16} /> nyomtatás</button><button className="secondary-action" onClick={() => setShowAnalysis((value) => !value)}><FileText size={16} /> {showAnalysis ? "elemzés bezárása" : "szöveges elemzés"}</button></div></section>
              {showAnalysis && <section className="analysis-panel"><div className="analysis-mark"><span>DAT</span><Sparkles size={18} /></div><div><p className="eyebrow">Szöveges értelmezés</p><h3>{result.name || "A vizsgált személy"} szöveges elemzése</h3><p>A régi programból származó, ellenőrzött `.dat`-forrásszövegek jelennek meg. Ezek a tipológiai kombináció értelmezései, nem újraszámított állítások.</p>{getDatAnalyses(result.markers).map((analysis) => <article className="dat-analysis" key={analysis.code}><h4>{analysis.code}</h4><p>{analysis.text}</p></article>)}{getDatAnalyses(result.markers).length === 0 && <p>Ehhez a dátumhoz még nincs ellenőrzött .dat-hozzárendelés a webes adatmodellben.</p>}</div></section>}
            </div>
          ) : (
            <section className="empty-state"><div className="empty-orbit" aria-hidden="true"><span /><span /><span /></div><p className="eyebrow">Várakozó adatlap</p><h2>A számítás eredménye itt jelenik meg.</h2><p>Írd be a nevet és a dátumot, majd indítsd el a számítást.</p></section>
          )}
        </section>
      </div>
      <footer className="app-footer"><span>KRONO / 01</span><span>tipológiai számítás · böngészőben</span><span>© 2026</span></footer>
    </main>
  );
}
