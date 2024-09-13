const x = document.getElementById("cidade");
var lat;
var lng;

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCidade);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function getCidade(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;

    var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
        if (data.address && data.address.city) {
            document.getElementById("cidade").textContent = data.address.city;
        } else {
            document.getElementById("cidade").textContent = "Cidade não encontrada";
        }
    })
    .catch(error => console.error('Erro:', error));
}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }

  function obterDataHoraAtual() {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const mesesAno = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  
    const agora = new Date();
    
    const diaSemana = diasSemana[agora.getDay()];
    const dia = agora.getDate();
    const mes = mesesAno[agora.getMonth()];
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
  
    return `${diaSemana}, ${dia} de ${mes}, ${horas}:${minutos}`;
    
  }
  
  document.getElementById("datahora").textContent = obterDataHoraAtual();


  // Adiciona o evento de escuta para a tecla Enter no campo de busca uma única vez
document.getElementById("inputLocal").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
      event.preventDefault(); // Evita o comportamento padrão
      pesquisarLugar(); // Chama a função de pesquisa
  }
});


function pesquisarLugar() {
    var local = document.getElementById("inputLocal").value;
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${local}&limit=1&appid=88bc384b754094ce3a19afb5355a6d72`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json(); 
        })
        .then(data => {
            if (data.length > 0) {
                
                const lugar = data[0];
              
                const lat = lugar.lat;
                const lon = lugar.lon;
                const nome = lugar.local_names ? lugar.local_names.pt : lugar.name;
                climaLugar(lat, lon, nome); 
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
        
  
  