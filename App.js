const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const readline = require("readline");

const port = process.env.PORT || 3000

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req,file,cb) {
        cb("","archivo.txt");
    }
})
const upload = multer({
    storage: storage
});

app.get("/",(req,res) => {
    
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/files",upload.single('archivo'),(req,res) => {
    let arrTodos = [];
    let contador = 0;
    let cant = 0;
    const rl = readline.createInterface({
        input: fs.createReadStream(__dirname + "/uploads/archivo.txt"),
        output: process.stdout,
        terminal: false
    });
    rl.on('line', function (line) {
        if(contador==0) {
           cant = parseInt(line);   
        }
        else {
            arrTodos.push(line.split(" "));
        }
        console.log("linea nro: " +contador);
        //console.log(line); 
        
        if(contador==cant) {
            rl.close();
            let ganador = CalcularGanador(arrTodos);
            console.log(ganador);
            console.log("GANADORRRRRRRRRRRRRRRRRRRRRRRRR")
         
            generarArchivo(ganador);
        }
        contador++;
    });
    res.sendFile(__dirname + "/views/respuesta.html");
    
    
});
app.get('/download', (req, res)  => { 
    let file = __dirname + '/uploads/ganador.txt'; 
    res.download(file); 
});


function generarArchivo(ganador) {
    fs.writeFile("uploads/ganador.txt", ganador[0].toString() + " " + ganador[1].toString() , function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("El archivo se ha guardado correctamente!");
    });
}
function CalcularGanador(arrTodos) {
    for(let x=0; x<arrTodos.length; x++) {
        if(parseInt(arrTodos[x][0]) < parseInt(arrTodos[x][1])) {
            arrTodos[x][1] = parseInt(arrTodos[x][1]) - parseInt(arrTodos[x][0]);
            arrTodos[x][0] = 2;
        }else {
            arrTodos[x][1] = arrTodos[x][0] - arrTodos[x][1];
            arrTodos[x][0] = 1;
        }
    }
    let mayor = 0;
    let jugGanador = 0;
    for(let y=0; y<arrTodos.length; y++) {
        if (parseInt(arrTodos[y][1]) > mayor)
        {  
            jugGanador = arrTodos[y][0];
            mayor = arrTodos[y][1]; 
        }
    }
   
    return Array(jugGanador,mayor);
}

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})