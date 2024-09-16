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
            climaLugar(lat, lng, data.address.city);  // Obtém o clima atual
            climaFuturo(lat, lng);  // Obtém a previsão futura
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

function climaLugar(lat, long, nome) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=88bc384b754094ce3a19afb5355a6d72&lang=pt_br&units=metric`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro na requisição');
          }
          return response.json();
      })
      .then(data => {
          if (data != null) {
              const temperatura = data.main.temp.toFixed(2);  // Limita para 2 casas decimais
              document.getElementById("cidade").innerHTML = `Nome: ${nome}<br>Temperatura: ${temperatura}°C`;
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

      const temperatura = previsao.main.temp.toFixed(2);  // Limita para 2 casas decimais
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
