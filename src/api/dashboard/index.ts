export async function getPreAssesReport(client_id: string, user_id: string) {
  const res = await fetch(
    `https://2w24txr2ecpc36zqwk4v4vdmva0ohppf.lambda-url.eu-north-1.on.aws/dashboard/get_post_assesment_reports?client_id=${client_id}&user_id=${user_id}`,
    {
      method: 'POST',
      body: {},
    },
  );
  const resbody = await res.json();

  return JSON.parse(resbody.body);
}
