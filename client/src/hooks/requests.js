const BASE_API_URL = "v1";
async function httpGetPlanets() {
  const res = await fetch(`${BASE_API_URL}/planets`);
  return await res.json();
}

async function httpGetLaunches() {
  const res = await fetch(`${BASE_API_URL}/launches`);
  return (await res.json()).sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    const res = await fetch(`${BASE_API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ launch: launch }),
    });
    return await res.json();
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    const res = await fetch(`${BASE_API_URL}/launches/${id}`, {
      method: "delete",
    });
    return res;
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
