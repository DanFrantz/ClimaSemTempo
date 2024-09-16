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
      climaFuturo(lat,lon);

    } else {
      document.getElementById("cidade").innerHTML = "Nenhum resultado encontrado.";
    }
  })
  .catch(error => console.error('Erro:', error));
}

function climaLugar(lat,long,nome){

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=88bc384b754094ce3a19afb5355a6d72&lang=pt_br&units=metric`)//Busca os dados do dia.
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
  // Adiciona o evento de escuta para a tecla Enter no campo de busca uma única vez
  document.getElementById("inputLocal").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita o comportamento padrão
        pesquisarLugar(); // Chama a função de pesquisa
    }
  });
  
function climaFuturo(lat,long){
  console.log(" assssaassa")
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&cnt=12&appid=88bc384b754094ce3a19afb5355a6d72&lang=pt_br&units=metric`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    return response.json(); // Converte a resposta para JSON e retorna
  })
  .then(data => {
    if (data!=null){
      console.log(data)
        }
  })
  .catch(error => console.error('Erro:', error));
}




