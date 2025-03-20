const express = require('express');
const cors = require('cors');
const {config, saveToken} = require("./config");

const app = express()

app.use(cors())

const authHtml = "<script> function extractAccessToken(url) { const regex = /#.*access_token=([^&]+)/; const match = url.match(regex); return match ? match[1] : null; } const token = extractAccessToken(window.location.href); if (token) { fetch(`http://localhost:9192/confirm/${token}`, { method: \"POST\" }) .then(() => document.getElementById(\"result\").innerText = ` Done! You can close this page.\\n \\n Готово! Вы можете закрыть эту страницу.`) .catch((e) => { document.getElementById(\"result\").innerText = ` Something went wrong! Check web console\\n \\n Что-то пошло не так! Проверьте консоль`; console.log(e); }); } else { document.getElementById(\"result\").innerText = ` Access token not found!\\n \\n Токен не обнаружен!`; } </script> <div id=\"result\"></div>";
app.get("/auth/", (req, res) => {
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from(authHtml.replace("9192", `${config.port}`)))
});

app.post('/confirm/:token', async (req, res) => {
    saveToken(req.params.token);
    res.sendStatus(200);
});

app.get('/:id', async (req, res) => {
    if (config.accessToken == null || config.clientId == null) {
        res.sendStatus(500);
        return;
    }
    try {
        let response = await fetch(`https://api.twitch.tv/helix/users?id=${req.params.id}`, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Methods': 'OPTIONS, GET',
                "Authorization": `Bearer ${config.accessToken}`,
                "Client-Id": config.clientId,
                "Cache-Control": "private max-age=21600",
            },
            "credentials": "same-origin",
        });
        if (response.status === 200) {
            const data = await response.json();
            const avatar = data["data"][0]["profile_image_url"];
            res.send(avatar);
            return;
        }
    } catch (e) {
        //pass
    }
    res.sendStatus(404);
});

app.listen(config.port, () => {
    console.log(`tabs started on ${config.port}`)
});
