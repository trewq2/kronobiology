// Világos, reszponzív adatlap, következetes fizikai–érzelmi–intellektuális színkóddal.

import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, FileText, Printer, RotateCcw, Sparkles, ShieldCheck } from "lucide-react";
import {
  calculateChronobiology,
  formatDate,
  validateBirthDate,
  type ChronobiologyResult,
  type LevelKey,
  type LevelResult,
} from "@/lib/kronobiologia";
import { getDatAnalyses } from "@/lib/datAnalyses";

const logoAsset = `${import.meta.env.BASE_URL}assets/kronobiologia-mark_a0b7cc0c.png`;

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
    <span className={`level-pill ${style.soft} ${style.text}`}>
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
        <div><p className="eyebrow">03 · Kontúr</p><h3>Agyfélteke- és testkontúr</h3></div>
      </div>
      <div className="contour-visual contour-classic">
        <svg viewBox="0 0 520 570" role="img" aria-label="Eredeti program szerinti agyfélteke- és testkontúr">
          <defs>
            <marker id="contour-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#111" /></marker>
          </defs>
          <path d="M260 18 C206 18 178 55 178 112 C178 164 202 195 260 222 C318 195 342 164 342 112 C342 55 314 18 260 18 Z" className="classic-contour" />
          <path d="M178 78 C208 80 232 80 260 80 C288 80 312 80 342 78" className="classic-divider" />
          <path d="M180 126 C210 128 234 128 260 128 C286 128 310 128 340 126" className="classic-divider" />
          <path d="M182 174 C210 176 236 176 260 176 C284 176 310 176 338 174" className="classic-divider" />
          <line x1="260" y1="20" x2="260" y2="222" className="classic-divider" />
          <text x="226" y="61" textAnchor="middle" className="classic-blue">{String(intellectual.right).padStart(2, "0")}</text><text x="294" y="61" textAnchor="middle" className="classic-blue">{String(intellectual.left).padStart(2, "0")}</text>
          <text x="226" y="109" textAnchor="middle" className="classic-green">{String(emotional.right).padStart(2, "0")}</text><text x="294" y="109" textAnchor="middle" className="classic-green">{String(emotional.left).padStart(2, "0")}</text>
          <text x="226" y="157" textAnchor="middle" className="classic-red">{String(physical.right).padStart(2, "0")}</text><text x="294" y="157" textAnchor="middle" className="classic-red">{String(physical.left).padStart(2, "0")}</text>
          <path d="M158 38 C120 82 122 151 190 207" className="classic-arrow" markerEnd="url(#contour-arrow)" /><path d="M362 38 C400 82 398 151 330 207" className="classic-arrow classic-arrow-heavy" markerEnd="url(#contour-arrow)" />
          <rect x="30" y="82" width="82" height="36" className="sum-box" /><text x="71" y="106" textAnchor="middle" className="sum-text">{result.rightBrain}</text><text x="71" y="64" textAnchor="middle" className="side-label">Jobb</text><text x="71" y="76" textAnchor="middle" className="side-label">agyfélteke</text>
          <rect x="408" y="82" width="82" height="36" className="sum-box" /><text x="449" y="106" textAnchor="middle" className="sum-text">{result.leftBrain}</text><text x="449" y="64" textAnchor="middle" className="side-label">Bal</text><text x="449" y="76" textAnchor="middle" className="side-label">agyfélteke</text>
          <path d="M260 222 C204 252 146 290 146 384 C146 474 194 526 260 526 C326 526 374 474 374 384 C374 290 316 252 260 222 Z" className="classic-contour" />
          <text x="260" y="285" textAnchor="middle" className="classic-green">{String(emotional.left).padStart(2, "0")}</text>
          <text x="260" y="350" textAnchor="middle" className="classic-green">{String(emotional.right).padStart(2, "0")}</text>
          <text x="260" y="415" textAnchor="middle" className="classic-red">{String(physical.left).padStart(2, "0")}</text>
          <text x="260" y="480" textAnchor="middle" className="classic-red">{String(physical.right).padStart(2, "0")}</text>
          <path d="M186 246 C94 298 92 448 134 505" className="classic-arrow classic-arrow-heavy" markerEnd="url(#contour-arrow)" /><path d="M334 246 C426 298 428 448 386 505" className="classic-arrow" markerEnd="url(#contour-arrow)" />
          <rect x="18" y="380" width="82" height="36" className="sum-box" /><text x="59" y="404" textAnchor="middle" className="sum-text">{result.leftBrain}</text><text x="59" y="434" textAnchor="middle" className="side-label">a test</text><text x="59" y="448" textAnchor="middle" className="side-label">jobb oldala</text>
          <rect x="420" y="380" width="82" height="36" className="sum-box" /><text x="461" y="404" textAnchor="middle" className="sum-text">{result.rightBrain}</text><text x="461" y="434" textAnchor="middle" className="side-label">a test</text><text x="461" y="448" textAnchor="middle" className="side-label">bal oldala</text>
          <text x="260" y="550" textAnchor="middle" className="total-text">{result.total}</text>
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
          <p className="eyebrow">04 · Egyensúly</p>
          <h3>Jin–Jang összkép</h3>
        </div>
        <Sparkles size={18} strokeWidth={1.5} />
      </div>
      <div className="triangle-visual">
        <svg viewBox="0 0 420 400" role="img" aria-label="Jin–Jang összkép">
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
      <div className="diagram-legend" aria-label="Színjelölések"><span className="legend-physical">Fizikai</span><span className="legend-emotional">Érzelmi</span><span className="legend-intellectual">Intellektuális</span></div>
    </div>
  );
}

function MatrixCard({ result }: { result: ChronobiologyResult }) {
  return (
    <section className="matrix-shell">
      <div className="matrix-header">
        <div>
          <p className="eyebrow">02 · Személyes összkép</p>
          <h2>{result.name || "Névtelen vizsgálat"}</h2>
          <p className="muted-copy">Született: {formatDate(result.birthDate)}</p>
        </div>
        <div className="matrix-total">
          <span>Összes potenciál</span>
          <strong>{result.total}</strong>
        </div>
      </div>
      <div className="matrix-table" role="table" aria-label="Kronobiológiai marker mátrix">
        <div className="matrix-row matrix-row-head" role="row">
          <span role="columnheader">Marker / szint</span><span role="columnheader">Jobb agyfélteke</span><span role="columnheader">Bal agyfélteke</span><span role="columnheader">Típus</span>
        </div>
        {result.levels.map((level) => (
          <div className={`matrix-row level-${level.key}`} role="row" key={level.key}>
            <div className="marker-cell" role="cell"><MetricTag value={level.marker} level={level.key} /><span>{level.key === "physical" ? "Fizikai" : level.key === "emotional" ? "Érzelmi" : "Intellektuális"}<small>{level.key === "physical" ? "Temperamentum" : level.key === "emotional" ? "Érzelem" : "Intellektus"}</small></span></div>
            <div className="metric-cell" role="cell"><span className="mobile-column-label">Jobb agyfélteke</span><strong>{String(level.right).padStart(2, "0")}</strong><span>{level.rightLabel}</span></div>
            <div className="metric-cell" role="cell"><span className="mobile-column-label">Bal agyfélteke</span><strong>{String(level.left).padStart(2, "0")}</strong><span>{level.leftLabel}</span></div>
            <div className="type-cell" role="cell"><LevelPill level={level} /></div>
          </div>
        ))}
        <div className="matrix-row matrix-row-total" role="row">
          <span role="cell">Összesen</span><strong role="cell"><span className="mobile-column-label">Jobb agyfélteke</span>{result.rightBrain}</strong><strong role="cell"><span className="mobile-column-label">Bal agyfélteke</span>{result.leftBrain}</strong><span role="cell" className="total-points">{result.total} pont</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<ChronobiologyResult | null>(null);
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

      <header className="topbar">
        <div className="brand-lockup">
          <img className="brand-mark" src={logoAsset} alt="" />
          <div><strong>krono<span className="brand-period">.</span></strong><span className="brand-kicker">Kronobiológiai számítás</span></div>
        </div>
        <div className="topbar-note"><ShieldCheck size={16} aria-hidden="true" /><span>Az adataid a böngésződben maradnak</span></div>
      </header>

      <div className="app-grid">
        <section className="workspace">
          <div className="page-intro"><p className="eyebrow">Fizikai · Érzelmi · Intellektuális</p><h1>Kronobiológiai adatlap</h1><p>Három szint. Egy áttekinthető összkép.</p></div>
          <form className="input-panel" onSubmit={(event) => { event.preventDefault(); handleCalculate(); }} noValidate>
            <div className="input-panel-header"><div><span className="eyebrow">01 · Személyes adatok</span><h2>Kezdjük az alapokkal</h2><span className="input-code">KRB–{birthDate ? birthDate.slice(0, 4) : "0000"}</span></div></div>
            <div className="form-grid">
              <label className="field-wrap"><span>Név</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Teljes név" autoComplete="name" required /></label>
              <label className="field-wrap"><span>Születési dátum</span><div className="date-input-wrap"><CalendarDays size={18} /><input type="date" required min="1800-01-01" max="2020-12-31" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} aria-describedby="date-help" /></div><small id="date-help">A forrástáblázat időtartománya: 1800–2020 · {dateMeta}</small></label>
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <div className="form-actions"><button type="submit" className="primary-action"><span>Adatlap elkészítése</span><ChevronRight size={18} /></button><button type="button" className="quiet-action" onClick={handleReset}><RotateCcw size={16} /> Új adatlap</button></div>
          </form>

          {result ? (
            <div className="results-stack" aria-live="polite">
              <MatrixCard result={result} />
              <div className="diagram-grid"><ContourDiagram result={result} /><TriangleDiagram result={result} /></div>
              <section className="result-actions"><div><span className="eyebrow">05 · További részletek</span><h3>Vidd magaddal az adatlapod</h3></div><div className="result-buttons"><button className="secondary-action" onClick={() => window.print()}><Printer size={16} /> Nyomtatás / PDF</button><button className="secondary-action analysis-toggle" aria-expanded={showAnalysis} aria-controls="text-analysis" onClick={() => setShowAnalysis((value) => !value)}><FileText size={16} /> {showAnalysis ? "Elemzés bezárása" : "Szöveges elemzés"}</button></div></section>
              {showAnalysis && <section className="analysis-panel" id="text-analysis"><div className="analysis-mark"><span>DAT</span><Sparkles size={18} /></div><div><p className="eyebrow">Szöveges értelmezés</p><h3>{result.name || "A vizsgált személy"} szöveges elemzése</h3><p>Az alábbi történeti szövegek az eredeti program fizikai–érzelmi és fizikai–intellektuális típuskombinációihoz tartoznak. A módszer nem orvosi vagy pszichológiai diagnózis; a forrásszövegek egészségi állításai nem tekinthetők személyre szóló egészségügyi tanácsnak.</p>{getDatAnalyses(result.markers).map((analysis) => <article className="dat-analysis" key={analysis.code}><h4>{analysis.code}</h4><p>{analysis.text}</p></article>)}{getDatAnalyses(result.markers).length === 0 && <p>A megadott markerekhez nem található elemzés.</p>}</div></section>}
            </div>
          ) : (
            <section className="empty-state"><div className="empty-orbit" aria-hidden="true"><span /><span /><span /></div><div><p className="eyebrow">A te személyes összképed</p><h2>Itt rajzolódik ki az adatlapod.</h2><p>Add meg a neved és a születési dátumod a számításhoz.</p></div></section>
          )}
        </section>
      </div>
      <footer className="app-footer"><span>krono.</span><span>Személyes adatlap · Helyben számolva</span><span>© 2026</span></footer>
    </main>
  );
}
