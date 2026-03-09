//checking api
const issuesContainer = document.getElementById("issuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
let allIssues = [];
async function loadIssues() {

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues"
  );
  const data = await res.json();
  // console.log(data)
  allIssues = data.data;
  displayIssues(allIssues);
}

function updateIssueCount(issues) {
  const count = issues.length;
  document.getElementById("issueCount").innerText = `${count} Issues`;
}

// Loading issues into cards
function displayIssues(issues) {
  updateIssueCount(issues);
  issuesContainer.innerHTML = "";

  issues.forEach((issue) => {

    // Border color
    const borderColor =
      issue.status === "closed"
        ? "border-t-4 border-purple-500"
        : "border-t-4 border-green-500";

    // Status icon
    const statusIcon =
      issue.status === "closed"
        ? "assets/Closed- Status .png"
        : "assets/Open-Status.png";

    // Priority badge
    const priorityColor =
      issue.priority === "high"
        ? "bg-red-100 text-red-500"
        : issue.priority === "medium"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-gray-200 text-gray-500";

    // Labels
    let labelsHTML = "";

    issue.labels.forEach((label) => {

      const labelStyle =
        label === "bug"
          ? "bg-red-100 text-red-500"
          : label === "help wanted"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-600";
      const icon = label === "bug"
        ? '<i class="fa-solid fa-bug" style="color: rgb(243, 18, 23);"></i>'
        : label === "help wanted"
          ? '<i class="fa-solid fa-life-ring" style="color: rgb(225, 179, 10);"></i>'
          : '<i class="fa-regular fa-lightbulb text-green-800"></i>';

      labelsHTML += `
        <span class="px-3 py-1 text-xs rounded-full whitespace-nowrap ${labelStyle}">
          ${icon}
          ${label.toUpperCase()}
        </span>
      `;
    });

    const card = document.createElement("div");

    card.className = `
      bg-white rounded-xl shadow-sm ${borderColor}
      flex flex-col h-full
    `;

    card.innerHTML = `
      <div class="p-5 flex flex-col row">

        <!-- Header -->
        <div class="flex justify-between items-center mb-3">

          <div>
              <img src="${statusIcon}" class="w-7 h-7" alt="status icon">
          </div>

          <span class="px-3 py-1 text-sm rounded-full ${priorityColor}">
            ${issue.priority.toUpperCase()}
          </span>

        </div>

        <!-- Title -->
        <h3 class="font-semibold text-gray-800 mb-2">
          ${issue.title}
        </h3>

        <!-- Description -->
        <p class="text-sm text-gray-500 mb-4 ">
          ${issue.description}
        </p>

        <!-- Labels -->
        <div class="flex gap-2 flex-wrap">
          ${labelsHTML}
        </div>

      </div>

      <!-- Footer -->
      <div class="border-t px-5 py-3 text-sm text-gray-500">
        #${issue.id} by ${issue.author}
        <br>
        ${issue.createdAt || ""}
      </div>
    `;

    issuesContainer.appendChild(card);
    card.onclick = () => {
      openModal(issue);
    };
  });
}

// Init
loadIssues();

//Mpdal Function
function openModal(issue) {

  document.getElementById("modalTitle").innerText = issue.title;
  document.getElementById("modalDescription").innerText = issue.description;

  document.getElementById("modalAuthor").innerText = issue.author;
  document.getElementById("modalDate").innerText =
    new Date(issue.createdAt).toLocaleDateString();

  document.getElementById("modalAssignee").innerText = issue.assignee;

  // Status
  const status = document.getElementById("modalStatus");

  if (issue.status === "closed") {
    status.innerText = "Closed";
    status.className = "bg-purple-500 text-white px-3 py-1 rounded-full text-xs";
  } else {
    status.innerText = "Opened";
    status.className = "bg-green-500 text-white px-3 py-1 rounded-full text-xs";
  }

  // Priority
  const priority = document.getElementById("modalPriority");

  priority.innerText = issue.priority.toUpperCase();

  if (issue.priority === "high") {
    priority.className = "bg-red-500 text-white px-4 py-1 text-xs rounded-full";
  } else if (issue.priority === "medium") {
    priority.className = "bg-yellow-400 text-black px-4 py-1 text-xs rounded-full";
  } else {
    priority.className = "bg-gray-400 text-white px-4 py-1 text-xs rounded-full";
  }

  // Labels
  const labelsContainer = document.getElementById("modalLabels");
  labelsContainer.innerHTML = "";

  issue.labels.forEach(label => {

    let color =
      label === "bug"
        ? "bg-red-100 text-red-500"
        : label === "help wanted"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-600";

    labelsContainer.innerHTML += `
      <span class="px-3 py-1 text-xs rounded-full ${color}">
        ${label.toUpperCase()}
      </span>
    `;
  });

  document.getElementById("issueModal").classList.remove("hidden");
  document.getElementById("issueModal").classList.add("flex");
}

function closeModal() {
  document.getElementById("issueModal").classList.add("hidden");
}

function filterIssues(type, button) {

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("bg-purple-900", "text-white");
    btn.classList.add("border", "border-gray-300", "text-gray-600");
  });
  button.classList.add("bg-purple-900", "text-white");
  button.classList.remove("border", "border-gray-300", "text-gray-600");
  if (type === "all") {
    displayIssues(allIssues);
  }
  else if (type === "open") {
    const openIssues = allIssues.filter(issue => issue.status === "open");
    displayIssues(openIssues);
  }
  else if (type === "closed") {
    const closedIssues = allIssues.filter(issue => issue.status === "closed");
    displayIssues(closedIssues);
  }

}

// Search feature added
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", async function (e) {

  e.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    displayIssues(allIssues);
    return;
  }

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`
  );

  const data = await res.json();

  displayIssues(data.data);

});

