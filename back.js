window.addEventListener("load", () => {
  setTimeout(() => {
      document.querySelector(".loading-screen").style.display = "none";
      document.getElementById("main-content").style.display = "block";
  }, 3000); 
});

const x = document.getElementById("cidade");
var lat;
var lng;

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCidade, showError);
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





  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=88bc384b754094ce3a19afb5355a6d72&lang=pt_br&units=metric`)
.then(response => {
  if (!response.ok) {
    throw new Error('Erro na requisição');
  }
  return response.json(); // Converte a resposta para JSON e retorna
})
.then(data => {
  if (data!=null){
    document.getElementById("temperatura").innerHTML = `${Math.round(data.main.temp)}° C`;
    document.getElementById("sensacao").innerHTML = `Sensação de: ${Math.round(data.main.feels_like)}° C`;
    document.getElementById("umidade").innerHTML = `Umidade: ${Math.round(data.main.humidity)}%`;
    document.getElementById("vento").innerHTML = `Vento: ${Math.round((data.wind.speed)*3.6)}Km/h`;
    //document.getElementById("precipitacao").innerHTML = `Precipitação: ${data.rain.h}`;
  } else {
    document.getElementById("cidade").innerHTML = "Nenhum resultado encontrado.";
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
x  }
});

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
      document.getElementById("cidade").innerHTML = `${nome}`
      document.getElementById("temperatura").innerHTML = `${Math.round(data.main.temp)}° C`;
      document.getElementById("sensacao").innerHTML = `Sensação de: ${Math.round(data.main.feels_like)}° C`;
      document.getElementById("umidade").innerHTML = `Umidade: ${Math.round(data.main.humidity)}%`;
      document.getElementById("vento").innerHTML = `Vento: ${Math.round((data.wind.speed)*3.6)}Km/h`;
      //document.getElementById("precipitacao").innerHTML = `Precipitação: ${data.rain}`;

      const img = document.getElementById("imagemclima");

      if(data.weather.main === "clear") {
        img.src = "icons/clear-sky";
      }
      

    } else {
      document.getElementById("cidade").innerHTML = "Nenhum resultado encontrado.";
    }
  })
  .catch(error => console.error('Erro:', error));
}

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
                climaFuturo(lat, lon);
            } else {
                document.getElementById("cidade").innerHTML = "Nenhum resultado encontrado.";
            }
        })
        .catch(error => console.error('Erro:', error));
}


function climaFuturo(lat, long) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&cnt=40&appid=88bc384b754094ce3a19afb5355a6d72&lang=pt_br&units=metric`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro na requisição');
          }
          return response.json();
      })
      .then(data => {
          if (data != null) {
              exibirPrevisao(data.list);  // Chama a função para exibir a previsão das próximas horas
              exibirPrevisaoSemana(data.list);  // Chama a função para exibir a previsão semanal
          }
      })
      .catch(error => console.error('Erro:', error));
}


function exibirPrevisao(previsoes) {
  const previsaoContainer = document.getElementById("previsaoHoras");
  previsaoContainer.innerHTML = "";  // Limpa o conteúdo existente

  // Limita o número de previsões a 7
  const previsoesLimitadas = previsoes.slice(0, 7);  // Pega apenas as primeiras 7 previsões

  previsoesLimitadas.forEach(previsao => {
      const horario = new Date(previsao.dt * 1000).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
      });

      const temperatura = Math.round(previsao.main.temp);  // Limita para 2 casas decimais
      const descricao = previsao.weather[0].description;
      const icone = previsao.weather[0].icon;
      const iconeUrl = `http://openweathermap.org/img/wn/${icone}@2x.png`;

      // Cria um bloco para exibir a previsão
      const previsaoBloco = `
          <div class="previsao-hora">
              <p>${horario}</p>
              <img src="${iconeUrl}" alt="Icone do clima">
              <p>${temperatura}° C</p>
              <p>${descricao}</p>
          </div>
      `;
      previsaoContainer.innerHTML += previsaoBloco;  // Adiciona ao container
  });
}
function exibirPrevisaoSemana(previsoes) {
  const previsaoSemanaContainer = document.querySelector('.daily');
  previsaoSemanaContainer.innerHTML = "";
  
  const previsaoPorDia = {};
  
  previsoes.forEach(previsao => {
      const data = new Date(previsao.dt * 1000);
      const dia = data.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });
      
      if (!previsaoPorDia[dia]) {
          previsaoPorDia[dia] = {
              tempMax: previsao.main.temp_max,
              tempMin: previsao.main.temp_min,
              descricao: previsao.weather[0].description,
              icone: previsao.weather[0].icon,
          };
      }
  });
  bject.keys(previsaoPorDia).forEach(dia => {
    const previsao = previsaoPorDia[dia];
    const iconeUrl = `http://openweathermap.org/img/wn/${previsao.icone}@2x.png`;

  
    const previsaoBloco = `
        <div class="dia">
            <p>${dia}</p>
            <img src="${iconeUrl}" alt="Icone do clima">
            <p>Máx: ${previsao.tempMax.toFixed(2)}° C</p>
            <p>Mín: ${previsao.tempMin.toFixed(2)}° C</p>
            <p>${previsao.descricao}</p>
        </div>
    `;
    previsaoSemanaContainer.innerHTML += previsaoBloco;  
});
}
