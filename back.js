function pesquisarLugar(){
let local=document.getElementById("inputLocal").value;
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${local}&limit=0&appid=88bc384b754094ce3a19afb5355a6d72`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    return response.json(); // Converte a resposta para JSON e retorna
  })
  .then(data => {
    if (data.length > 0) {
      // Pega o primeiro resultado da pesquisa
      const lugar = data[0];
      //Salvando a latitude e longitude da cidade pesquisada
      const lat=lugar.lat;
      const lon=lugar.lon;
      const nome=lugar.local_names.pt;
      climaLugar(lat,lon,nome);
    } else {
      document.getElementById("cidade").innerHTML = "Nenhum resultado encontrado.";
    }
  })
  .catch(error => console.error('Erro:', error));
}

function climaLugar(lat,long,nome){
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=88bc384b754094ce3a19afb5355a6d72&lang=pt_br&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        return response.json(); // Converte a resposta para JSON e retorna
      })
      .then(data => {
        if (data!=null){
          document.getElementById("cidade").innerHTML = `Nome:${nome}<br>Temperatura:${data.main.temp}.`
        } else {
          document.getElementById("cidade").innerHTML = "Nenhum resultado encontrado.";
        }
      })
      .catch(error => console.error('Erro:', error));
    }
    


