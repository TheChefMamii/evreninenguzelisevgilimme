// telegram.js
const BOT_TOKEN = '8387694074:AAHF30x-1NcmE0Gs4v2jWMpyJPDuwy0XCa4'; 
const CHAT_ID = '6750266187';

function sendTelegram(customMsg) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            text: customMsg 
        })
    });
}


if (sendBtn) {
    sendBtn.onclick = () => {
        const msg = document.getElementById('messageText').value.trim();
        if(!msg) {
            alert('Ne söylemek istersin güzelimm❤️');
            return;
        }
        
        sendTelegram(`❤️ Evrenin en güzel kızından mesaj:\n\n${msg}`)
        .then(r => r.json())
        .then(data => {
            if(data.ok) {
                alert('Mesajın gitti');
                document.getElementById('messageText').value = '';
            } else {
                alert('Bir hata oluştu.');
            }
        })
        .catch(() => alert('Bağlantı hatası.'));
    };
}