const base_url = "https://cy-meda.azurewebsites.net";

export async function getPostAssesReport(token: string) {
  const res = await fetch(`${base_url}/dashboard/get_post_assesment_reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Assuming you need to send a token
    },
    body: JSON.stringify({}), // Assuming you might want to send an empty object
  });

  const resbody = await res.json();

  return resbody; // Return the parsed JSON response
}

export async function getPreAssesReport(token: string) {
  const res = await fetch(`${base_url}/dashboard/get_pre_assesment_reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Assuming you need to send a token
    },
    body: JSON.stringify({}),
  });
  const resbody = await res.json();

  return resbody;
}

export async function createAssessment(
  formData: FormData,
  token: string | null,
  projectName: string,
  projectDescription: string,
) {
  try {
    const clientId = localStorage.getItem("client_id") || "coforge";
    const userId = localStorage.getItem("user_id") || "admin@sigmared.ai";
    const url = `${base_url}/dashboard/create_assesment/?client_id=${encodeURIComponent(
      clientId,
    )}&user_id=${encodeURIComponent(
      userId,
    )}&assessment_name=${encodeURIComponent(
      projectName,
    )}&details=${encodeURIComponent(
      projectDescription || "Details not provided",
    )}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Token for authentication
      },
      body: formData, // FormData object containing the files and other data
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Assuming the response is already in JSON format
  } catch (error) {
    console.error("Error in createAssessment:", error);
    throw error;
  }
}

export async function getAssessment(client_id: string, token: string) {
  const response = await fetch(
    `${base_url}/dashboard/get_all_assessments/?client_id=${client_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you need to send a token
      },
      body: {},
    },
  );
  const result = await response.json();
  return result;
}

export async function getSaveContinue(body: object, token: string) {
  const response = await fetch(`${base_url}/dashboard/save_table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Assuming you need to send a token
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return result;
}

export async function updateAssessment(body: object, token: string) {
  const response = await fetch(
    `${base_url}/dashboard/update_assessment_status/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you need to send a token
      },
      body: JSON.stringify(body),
    },
  );
  const result = await response.json();
  return result;
}

export async function fetchUpdatedTableData(
  client: string,
  assesment_name: string,
  token: string,
) {
  const response = await fetch(
    `${base_url}/dashboard/get_table?assessment_name=${assesment_name}&client_id=${client}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you need to send a token
      },
    },
  );
  const result = await response.json();
  return result;
}

export async function fetchAssessmentStatus(
  client: string,
  assesment_name: string,
  token: string,
) {
  const response = await fetch(
    `${base_url}/dashboard/assessments/status?assessment_name=${assesment_name}&client_id=${client}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Assuming you need to send a token
      },
      body: {},
    },
  );
  const result = await response.json();
  return result;
}
