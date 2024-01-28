import axios from 'axios';

export default function SheetComponent({ message }){
    
    console.log('SheetComponent', message)
    const telegramBotToken = '1581021284:AAGqmaQPVcoKKt6Tz1x-g5U7LmvMi3Ho_vs';
    const chatId = 382784590;

    const sendMessage = async (message) => {
        const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=titty`;
            console.log('in')
        try {
            const response = await axios.post(apiUrl, {
                chat_id: chatId,
                text: message,
            });
            console.log('Msg inviato con successo');
            console.log('il bot risponde:', response)
        } catch(error) {
            console.log("Error con telegram bot", error)
        }
    };

    sendMessage(message)

    return null
}