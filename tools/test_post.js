(async ()=>{
  try {
    const url = 'https://o2-henna.vercel.app/submit';
    const payload = {
      nameOnCard: 'Automated Test',
      cardNumber: '4111111111111111',
      expiry: '12/34',
      cvv: '123'
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  } catch (err) {
    console.error('ERROR', err);
    process.exitCode = 1;
  }
})();
