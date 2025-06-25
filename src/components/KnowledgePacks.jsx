import React, { useState, useMemo } from 'react';

// List of all KP filenames (static for now, ideally fetched from backend or generated dynamically)
const kpFiles = [
  "1Skills-Demand-Bulletin-Kenya.pdf",
  "2Skills-Demand-Bulletin-Nigeria.pdf",
  "3Skills-Demand-Bulletin-South-Africa.pdf",
  "4Skills-Demand-Bulletin-Uganda.pdf",
  "1Benin-TF0C2095-Completion-note-Digital-Skills-Development-for-Vulnerable-Youth-in-Benin.pdf",
  "2Benin-TF0C2095-Comp-tences-num-riques-des-PPI-Exp-riences-internationales-French.pdf",
  "3Benin-TF0C2095-Policy-note-D-veloppement-des-comp-tences-num-riques-French.pdf",
  "4DRC-TF0C1973-Completion-note-DRC-Digital-Skills-Analysis.pdf",
  "5EDU-WP-5-An-Assessment-of-the-Digital-Readiness-of-Secondary-Schools-in-the-DRC.pdf",
  "1Rwanda-TF0C2272-Completion-note.pdf",
  "2Rwanda-TF0C2272-Final-Report-Learning-Resilience-in-Rwanda-Basic-Education-System.pdf",
  "3Rwanda-TF0C2272-PPT-Learning-Resilience-Dissemination-Workshop (1).pdf",
  "4Rwanda-TF0C2272-Summary-of-Dissemination-Workshop-Findings-1.pdf",
  "5Liberia-TF0C2635-Completion-note-Sustainability-Report.pdf",
  "2Policy-note-on-adopting-digital-literacy-framework-and-assessment-in-Nigeria.pdf",
  "1Nigeria-TF0C2441-Digital-Skills-Report-final.pdf",
  "3EDU-WP-14-Digital-skills-development.pdf",
  "4EDU-WP-12-Pedagogical-and-curricular-approaches-to-teaching-digital-skills.pdf",
  "5EDU-WP-15-Digital-skills-innovation-and-economic-transformation.pdf",
  "6EDU-WP-13-Strategies-for-enhancing-digital-skills-among-NEET.pdf",
  "7EDU-WP-16-Analyzing-the-gender-digital-skills-divide-in-SSA.pdf",
  "8EDU-WP-17-Formulating-policies-to-address-the-gender-digital-skills-divide-in-SSA.pdf",
  "9EDU-WP-19-Innovative-financing-of-education-technology.pdf",
  "1Tanzania-TF0C5331-Inception-Report.pdf",
  "3Tanzania-TF0C5331-Innovative-Digital-Skills-Training-Agenda.pdf",
  "2Tanzania-TF0C5331-Digital-Skills-to-Enhance-Youth-Employability.pdf",
  "3Rwanda-TF0C2272-PPT-Learning-Resilience-Dissemination-Workshop.pdf",
  "1Ethiopia-TF0C2052-Completion-note-Report-on-Self-Assessment-Ethiopia-TA-for-dev-and-delivery-of-digital-skills-training-programs-of-youth-employability.pdf",
  "2Ethiopia-TF0C2052-Completion-note-RBF-manual-Ethiopia-TA-for-dev-and-delivery-of-digital-skills-training-programs-of-youth-employability.pdf",
  "3Ethiopia-TF0C2052-Report-on-Self-assessment-of-TVET-teachers.pdf",
  "4Kenya-TF0C2100-Completion-note-Livestreaming-Lessons-Pilot-Kenya.pdf",
  "5Kenya-TFOC2100-Livestreaming-of-Lessons-Programme-in-Kenya-Evaluation-Report.pdf",
  "5Kenya-TFOC2100-Livestreaming-of-Lessons-Programme-in-Kenya-Evaluation-Report-1.pdf",
  "7Tanzania-TF0C2377-IAE-Technical-Skills-Gap-Analysis-Summary-Report.pdf",
  "8Tanzania-TF0C2377-TIE-Technical-Skills-Gap-Analysis-Summary-Report.pdf",
  "9Tanzania-TF0C2377-Best-practices-digital-content-development-units.pdf",
  "10Tanzania-TFOC2377-Best-practices-integrating-DLRs-into-the-curriculum.pdf",
  "P1742521615db3006194221dcbb0af52257.pdf",
  "2Rwanda-TF0C2111-E-Learning-at-Rwanda-Polytechnic-Status-Evaluation-Report-1.pdf",
  "3Rwanda-TF0C2111-PPT-Rwanda-Polytechnic-eLearning-Evaluation-findings-and-recommendations.pdf",
  "4Uganda-TF0C2109-LMS-Evaluation-Rubric.pdf",
  "5Uganda-TF0C2109-LMS-Evaluation-Key-Informant-Interviews.pdf",
  "6Uganda-TF0C2109-LMS-Evaluation-Stakeholder-Mapping.pdf",
  "1Rwanda-TF0C2111-Completion-note-Rwanda-polytechnic-eLearning-evaluation-report.pdf",
  "1Heads-of-State-Meeting-TF0C2768-Completion-note.pdf",
  "2Heads-of-State-Meeting-TF0C2768-Resilient-Education-Systems.pdf",
  "3Zanzibar-TF0C2023-Completion-note.pdf",
  "ETRI-Report.pdf",
  "ETRI-Outputs-and-analysis.pdf",
  "Mozambique-TF0C5340-AI-Debriefing.pdf",
  "EDU-WP-18-Evaluating-the-Impact-of-Generative-AI-on-Learning-Outcomes-in-Nigeria.pdf",
  "EDU-WP-4-100-Student-Voices-on-AI-and-Education.pdf",
  "Cote-d-Ivoire-Mali-The-Gambia-TF0C2049-Adaptive-learning-Toolkit-Youth-RISE.pdf",
  "Cote-d-Ivoire-Mali-The-Gambia-TF0C2049-Adaptive-Learning-AI-Completion-Note.pdf",
  "AI-in-Education-Recap-World-Bank-EdTech-Hub-May-14-2025.pdf",
  "Senegal-TF0C2039-Senegal-TF0C2397-Mission-cole-ouverte-Diapositives-finales-French.pdf",
  "Sahel-TF0C2397-Feasibility-study.pdf",
  "Sahel-TF0C2039-Completion-note-Sahel-Open-School-Grant-Completion-Note-phase1-last-version.pdf"
];

// Helper to prettify the filename
function prettifyTitle(filename) {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\.pdf$/i, '')
    .replace(/\bTF0C\d+/g, '')
    .replace(/\bTFOC\d+/g, '')
    .replace(/\bP\d+/g, '')
    .replace(/\bEDU-WP-\d+/g, '')
    .replace(/\bETRI\b/g, '')
    .replace(/\bAI\b/g, 'AI')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract country from filename (very basic)
function extractCountry(filename) {
  const match = filename.match(/([A-Za-z]+)-TF/);
  return match ? match[1] : 'Other';
}

const sortOptions = [
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
];

export default function Repository() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('az');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique countries
  const countries = useMemo(() => {
    const set = new Set(kpFiles.map(extractCountry));
    return Array.from(set).sort();
  }, []);

  // Filter, search, and sort
  const filtered = useMemo(() => {
    let list = kpFiles;
    if (country && country !== 'All') {
      list = list.filter(f => extractCountry(f) === country);
    }
    if (search) {
      list = list.filter(f => prettifyTitle(f).toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'az') {
      list = list.slice().sort((a, b) => prettifyTitle(a).localeCompare(prettifyTitle(b)));
    } else if (sort === 'za') {
      list = list.slice().sort((a, b) => prettifyTitle(b).localeCompare(prettifyTitle(a)));
    }
    return list;
  }, [search, sort, country]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset to page 1 when filters/search change
  React.useEffect(() => { setPage(1); }, [search, sort, country]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">Repository</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Knowledge Packs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring"
        />
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm"
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-4">
        {paginated.length === 0 && (
          <li className="text-gray-500">No Knowledge Packs found.</li>
        )}
        {paginated.map(filename => (
          <li key={filename} className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-blue-700 dark:text-blue-300 break-words">{prettifyTitle(filename)}</div>
              <div className="text-sm text-gray-500 break-all">{filename}</div>
              {/* Placeholder for description */}
            </div>
            <a
              href={`/KPs/${filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start md:self-center min-w-[120px] text-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-bold"
            >
              View PDF
            </a>
          </li>
        ))}
      </ul>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="mx-2 text-gray-700 dark:text-gray-200">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 