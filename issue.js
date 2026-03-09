//checking api
const issuesContainer = document.getElementById("issuesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");

async function loadIssues() {

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues"
  );
  const data = await res.json();
  console.log(data)
  displayIssues(data.data);
}

// Loading issues into cards
function displayIssues(issues) {
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

      labelsHTML += `
        <span class="px-3 py-1 text-xs rounded-full whitespace-nowrap ${labelStyle}">
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
  });
}

// Init
loadIssues();