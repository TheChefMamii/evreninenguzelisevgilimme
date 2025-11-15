// telegram.js

// BURAYA KENDİ BOT TOKEN ve CHAT ID'ni YAPIŞTIR
const BOT_TOKEN = '8387694074:AAHF30x-1NcmE0Gs4v2jWMpyJPDuwy0XCa4'; 
const CHAT_ID = '6750266187';

document.getElementById('sendMsg').onclick = () => {
  const msg = document.getElementById('messageText').value.trim();
  if(!msg) {
    alert('Ne söylemek istersin güzelimm❤️');
    return;
  }
    
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: `❤️ Evrenin en güzel kızından mesaj:\n\n${msg}` })
  })
  .then(r => r.json())
  .then(data => {
    if(data.ok) {
      alert('Mesajın gitti');
      document.getElementById('messageText').value = '';
    } else {
      alert('Bir hata oluştu.');
    }
  })
  .catch(() => alert('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.'));

};
