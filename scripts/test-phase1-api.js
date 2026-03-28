async function main() {
  const loginResponse = await fetch('http://localhost:9002/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'demo@clinic.com',
      password: 'Demo12345',
      clinic_id: 'cmn63uh4c0000vs5ocaeppmwn',
    }),
  });

  const loginBody = await loginResponse.text();
  const setCookie = loginResponse.headers.get('set-cookie') || '';

  console.log('LOGIN_STATUS', loginResponse.status);
  console.log('LOGIN_BODY', loginBody);

  const cookieHeader = setCookie.split(';')[0];

  const meResponse = await fetch('http://localhost:9002/api/auth/me', {
    headers: { cookie: cookieHeader },
  });

  console.log('ME_STATUS', meResponse.status);
  console.log('ME_BODY', await meResponse.text());

  const patientsResponse = await fetch('http://localhost:9002/api/patients?page=1&limit=20', {
    headers: { cookie: cookieHeader },
  });

  console.log('PATIENTS_STATUS', patientsResponse.status);
  console.log('PATIENTS_BODY', await patientsResponse.text());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
