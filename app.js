const skillCatalog = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Python",
  "SQL",
  "Git",
  "GitHub",
  "API",
  "REST",
  "Node",
  "Express",
  "Testing",
  "Accessibility",
  "Responsive Design",
  "Data Analysis",
  "Communication",
  "Problem Solving",
  "Tailwind",
  "Vercel",
  "Firebase"
];

const sampleResume = `I am a beginner frontend developer learning HTML, CSS, JavaScript, React, Git, GitHub, responsive design, and problem solving. I have built small projects and want to improve API usage and testing.`;

const sampleJob = `We are hiring a junior frontend developer. The role needs HTML, CSS, JavaScript, React, GitHub, REST API experience, responsive design, accessibility, testing, communication, and problem solving. TypeScript is a plus.`;

const state = {
  latestScore: 0,
  latestMatched: [],
  latestMissing: [],
  applications: JSON.parse(localStorage.getItem("careerCoachApplications") || "[]")
};

const resumeInput = document.querySelector("#resumeInput");
const jobInput = document.querySelector("#jobInput");
const analyzeBtn = document.querySelector("#analyzeBtn");
const sampleBtn = document.querySelector("#sampleBtn");
const exportBtn = document.querySelector("#exportBtn");
const scoreValue = document.querySelector("#scoreValue");
const scoreMetric = document.querySelector("#scoreMetric");
const matchedMetric = document.querySelector("#matchedMetric");
const missingMetric = document.querySelector("#missingMetric");
const applicationMetric = document.querySelector("#applicationMetric");
const scoreRing = document.querySelector(".score-ring");
const scoreMessage = document.querySelector("#scoreMessage");
const matchedSkills = document.querySelector("#matchedSkills");
const missingSkills = document.querySelector("#missingSkills");
const learningPlan = document.querySelector("#learningPlan");
const questionsList = document.querySelector("#questionsList");
const resumeBullets = document.querySelector("#resumeBullets");
const trackerForm = document.querySelector("#trackerForm");
const trackerRows = document.querySelector("#trackerRows");
const clearTrackerBtn = document.querySelector("#clearTrackerBtn");

function normalize(text) {
  return text.toLowerCase();
}

function includesSkill(text, skill) {
  const readable = normalize(text);
  const variants = [skill, skill.replace(" ", ""), skill.replace("JavaScript", "JS")];
  return variants.some((variant) => readable.includes(normalize(variant)));
}

function getRequiredSkills(jobText) {
  const detected = skillCatalog.filter((skill) => includesSkill(jobText, skill));
  return detected.length > 0 ? detected : skillCatalog.slice(0, 8);
}

function renderTags(container, items, type) {
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("span");
    empty.className = "tag neutral";
    empty.textContent = "None yet";
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = `tag ${type}`;
    tag.textContent = item;
    container.appendChild(tag);
  });
}

function getScoreMessage(score) {
  if (score >= 80) return "Strong match. Polish your project examples and apply with confidence.";
  if (score >= 55) return "Promising match. Close a few gaps and tailor your resume for the role.";
  if (score >= 30) return "Early match. Use the learning plan to build proof for the missing skills.";
  return "Start with the foundations, then build one small project for the target role.";
}

function buildLearningPlan(missing) {
  if (!missing.length) {
    return [
      "Update your resume with project results and measurable outcomes.",
      "Practice explaining your strongest project in two minutes.",
      "Apply to the role and track the next follow-up date."
    ];
  }

  return missing.slice(0, 5).map((skill, index) => {
    const days = (index + 1) * 3;
    return `Spend ${days} days learning ${skill}, then add one small feature that proves it.`;
  });
}

function buildQuestions(matched, missing) {
  const focusSkills = [...matched.slice(0, 3), ...missing.slice(0, 2)];

  if (!focusSkills.length) {
    return [
      "Tell me about a project you built from start to finish.",
      "How do you debug a problem when you feel stuck?",
      "What are you learning next and why?"
    ];
  }

  return focusSkills.map((skill) => `How have you used ${skill}, and what would you improve next time?`);
}

function buildResumeBullets(score, matched, missing) {
  const matchedText = matched.slice(0, 4).join(", ") || "core web skills";
  const missingText = missing.slice(0, 3).join(", ") || "role-specific improvements";

  return [
    `Built a career readiness dashboard that analyzes resume and job description text to calculate a ${score}% match score.`,
    `Implemented keyword matching for ${matchedText}, plus learning recommendations for ${missingText}.`,
    "Created an application tracker with browser LocalStorage so saved roles persist after refresh."
  ];
}

function analyze() {
  const resumeText = resumeInput.value.trim();
  const jobText = jobInput.value.trim();

  if (!resumeText || !jobText) {
    alert("Paste both your resume or skills and a job description first.");
    return;
  }

  const required = getRequiredSkills(jobText);
  const matched = required.filter((skill) => includesSkill(resumeText, skill));
  const missing = required.filter((skill) => !includesSkill(resumeText, skill));
  const score = Math.round((matched.length / required.length) * 100);

  state.latestScore = score;
  state.latestMatched = matched;
  state.latestMissing = missing;

  scoreValue.textContent = `${score}%`;
  scoreMetric.textContent = `${score}%`;
  matchedMetric.textContent = matched.length;
  missingMetric.textContent = missing.length;
  scoreMessage.textContent = getScoreMessage(score);
  scoreRing.style.background = `conic-gradient(var(--green) ${score * 3.6}deg, var(--line) 0deg)`;

  renderTags(matchedSkills, matched, "match");
  renderTags(missingSkills, missing, "missing");
  renderPlan(buildLearningPlan(missing));
  renderQuestions(buildQuestions(matched, missing));
  renderResumeBullets(buildResumeBullets(score, matched, missing));
}

function renderPlan(items) {
  learningPlan.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    learningPlan.appendChild(li);
  });
}

function renderQuestions(items) {
  questionsList.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    questionsList.appendChild(li);
  });
}

function renderResumeBullets(items) {
  resumeBullets.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    resumeBullets.appendChild(li);
  });
}

function saveApplications() {
  localStorage.setItem("careerCoachApplications", JSON.stringify(state.applications));
}

function renderApplications() {
  trackerRows.innerHTML = "";
  applicationMetric.textContent = state.applications.length;

  if (!state.applications.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No applications yet. Add your first role after running an analysis.";
    row.appendChild(cell);
    trackerRows.appendChild(row);
    return;
  }

  state.applications.forEach((application) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(application.company)}</td>
      <td>${escapeHtml(application.role)}</td>
      <td><span class="status-pill">${escapeHtml(application.status)}</span></td>
      <td>${application.score}%</td>
      <td>${escapeHtml(application.notes)}</td>
    `;
    trackerRows.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addApplication(event) {
  event.preventDefault();

  const company = document.querySelector("#companyInput").value.trim();
  const role = document.querySelector("#roleInput").value.trim();
  const status = document.querySelector("#statusInput").value;
  const notes = document.querySelector("#notesInput").value.trim();

  state.applications.unshift({
    company,
    role,
    status,
    notes,
    score: state.latestScore
  });

  saveApplications();
  renderApplications();
  trackerForm.reset();
}

function exportSummary() {
  const summary = [
    "AI Career Coach Summary",
    "",
    `Match score: ${state.latestScore}%`,
    `Matched skills: ${state.latestMatched.join(", ") || "None"}`,
    `Missing skills: ${state.latestMissing.join(", ") || "None"}`,
    "",
    "Learning plan:",
    ...buildLearningPlan(state.latestMissing).map((item, index) => `${index + 1}. ${item}`),
    "",
    "Resume bullets:",
    ...buildResumeBullets(state.latestScore, state.latestMatched, state.latestMissing).map((item) => `- ${item}`)
  ].join("\\n");

  navigator.clipboard
    .writeText(summary)
    .then(() => alert("Summary copied to clipboard."))
    .catch(() => alert(summary));
}

sampleBtn.addEventListener("click", () => {
  resumeInput.value = sampleResume;
  jobInput.value = sampleJob;
  analyze();
});

analyzeBtn.addEventListener("click", analyze);
exportBtn.addEventListener("click", exportSummary);
trackerForm.addEventListener("submit", addApplication);
clearTrackerBtn.addEventListener("click", () => {
  if (!confirm("Clear all saved applications?")) return;
  state.applications = [];
  saveApplications();
  renderApplications();
});

renderTags(matchedSkills, [], "match");
renderTags(missingSkills, [], "missing");
renderPlan(["Run an analysis to generate a learning plan."]);
renderQuestions(["Run an analysis to generate interview questions."]);
renderResumeBullets(["Run an analysis to generate resume bullets for this project."]);
renderApplications();
