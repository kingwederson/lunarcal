
function calcularlunar(ano,mes,dia){
      let ciclocompleto = 630773.377902213
      let sjdinicial = 261266 // para 3998 B.C.
      let anociclo = ano%1727
      let duracao = emanosjudaicos[anociclo+1]-emanosjudaicos[anociclo]
      let leap
      let quantciclos = parseInt(ano/1727)
      let residuo = parseInt(quantciclos*0.377902212669142)
      let swd // dia sequencial do calendário lunissolar iniciado em 23 de março de 3998 B.C.
      let semanal
      let sjd // dia sequencial da data juliana iniciada em 24 de novembro d 4714 B.C. (-4713)
      let dia30
      let trocar13por12 = 0
      if(anociclo == 0){anociclo++}
      if(duracao<365){
            leap = 0
      }else{
            leap = 1
      }
      if(leap==0 && mes==13){
            mes = 12
            trocar13por12 = 1
      }
      // Avalia a legalidade do dia 30
      if(mes%2==1){
            dia30 = 1
      }else if(mes==12 && duracao==355){
            dia30 = 1
      }else{
            dia30 = 0
      }
      if(dia30==0 && dia == 30){
            document.getElementById("datajudaica").innerText = "The 30ᵗʰ day is not allowed."
            return "The 30th day is not allowed."
      }
      if(dia < 1 || dia > 30){
            document.getElementById("datajudaica").innerText = "This day is not allowed."
            return "This day is not allowed."
      }
      if(mes > 13){
            document.getElementById("datajudaica").innerText = "This month number is not allowed."
            return "This month number is not allowed."
      }
      swd = parseInt(quantciclos*ciclocompleto)+emanosjudaicos[anociclo]+emmesesjudaicos[mes]+dia+residuo
      sjd = swd+sjdinicial
      semanal = swd%7
      document.getElementById("datajudaica").innerText = `${semana[semanal]}, ${dia} ${meses[leap][mes]} ${ano.toString().padStart(4, '0')} → JD: ${parseInt(sjd)} ¾ ± ½`
      return parseInt(sjd)
}
function julianoparagregoriano(sjd) {
      let l = Math.floor(sjd) + 68569;
      let n = Math.floor(4 * l / 146097);
      l = l - Math.floor((146097 * n + 3) / 4);
      let i = Math.floor(4000 * (l + 1) / 1461001);
      l = l - Math.floor(1461 * i / 4) + 31;
      let j = Math.floor(80 * l / 2447);
      let d = l - Math.floor(2447 * j / 80);
      l = Math.floor(j / 11);
      let m = j + 2 - 12 * l;
      let y = 100 * (n - 49) + i + l;
      let diadasemana = sjd%7

      //var dayStr = d < 10 ? '0' + d : d;
      //var monthStr = m < 10 ? '0' + m : m;
      var yearStr = y > 0 ? y : (1 - y) + ' BCE';

      document.getElementById("datagregoriana").innerText = `${semanagregoriana[diadasemana]}, ${d} ${emmesesgregorianos[m]} ${yearStr.toString().padStart(4, '0')} → JD: ${parseInt(sjd)} ½ ± ½`;

      return `${semanagregoriana[diadasemana]} ${yearStr.toString().padStart(4, '0')} ${emmesesgregorianos[m]} ${d}`;
}
function teste(){
      ano = Number(document.getElementById('anolunar').value)
      mes = Number(document.getElementById('meslunar').value)
      dia = Number(document.getElementById('dialunar').value)
      return julianoparagregoriano(calcularlunar(ano,mes,dia))
}