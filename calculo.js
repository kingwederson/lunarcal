
function resto(dividendo,divisor){
      return (dividendo%divisor+divisor)%divisor
}
function ciclo(dividendo,divisor){
      dividendo--;
      return 1+(dividendo%divisor+divisor)%divisor
}

var cicloanos = 1727
var ciclodias = 630773.377902212669142
var anotropical = 365.2421896698
var messinodico = 29.530588853
var swdinicial = 127 // para 3998 BCE | -46265 para 4839 BCE.
var sgdinicial = -1200821

function lunarparajuliano(ano,mes,dia){
      let ciclocompleto = ciclodias
      let anociclo = ciclo(ano,cicloanos);
      let duracao = acuanoslunares[anociclo+1]-acuanoslunares[anociclo]
      let leap
      let quantciclos = Math.floor((ano - 1) / cicloanos);
      let swd // dia sequencial do calendário lunissolar. Dia 1 é em 23 de março de 3998 B.C. (-3997).
      let semanal
      let sjd // dia sequencial da data juliana. Dia 0 é 24 de novembro d 4714 B.C. (-4713).
      let dia30
      let trocar13por12 = 0
      if(anociclo == 0){anociclo = cicloanos}
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
      if(resto(mes,2)==1){
            dia30 = 1
      }else if(mes==12 && duracao==355){
            dia30 = 1
      }else{
            dia30 = 0
      }
      if(dia30==0 && dia == 30){
            if(anociclo==cicloanos && acucicloslunaresmudou[quantciclos] == 1){
                  dia30 = 1;
                  dia = 30
            }else{
                  dia = 29
            }
      }
      swd = parseInt(quantciclos*ciclocompleto)+acuanoslunares[anociclo]+acumeseslunares[mes]+dia+acucicloslunares[quantciclos]
      document.getElementById("dataswd").innerText = `SDW: ${swd.toLocaleString('fr-FR')}`;
      sjd = swd+swdinicial
      semanal = resto(swd,7)
      if(ano < 1){
            document.getElementById("datalunar").innerText = "Date before epoch.";
      }else{
            document.getElementById("datalunar").innerHTML = `${semanalunar[semanal]}, ${dia > 0 ? dia : '<span class="info" title="pridie kalendas">pk</span>'} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} <span class="info" title="Joseph Justus Scaliger was the author of Sequencial Julian Day, with day zero at 24th November 4714 BCE. In this calendar day 1 is at 31st March 4713 BCE.">Scaliger Era</span>`
      }
      document.getElementById("datajuliana").innerText = `Julian date at noon: ${(sjd).toLocaleString('fr-FR')}`;
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
      let diadasemana = resto(sjd,7)

      //var dayStr = d < 10 ? '0' + d : d;
      //var monthStr = m < 10 ? '0' + m : m;
      let anostring = y > 0 ? y.toString().padStart(4, '0') + ' AD' : (1 - y).toString().padStart(4, '0') + ' BCE';

      document.getElementById("datagregoriana").innerText = `${semanagregoriana[diadasemana]}, ${d} ${mesesgregorianos[m]} ${anostring.toString().padStart(4, '0')}`;
      document.getElementById("datajuliana").innerText = `Julian date at noon: ${(sjd).toLocaleString('fr-FR')}`;

      console.log(`${y}-${m}-${d}`)
      return `${semanagregoriana[diadasemana]} ${d} ${mesesgregorianos[m]} ${anostring}`;
}
function gregorianoparajuliano(ano,mes,dia){
      if(document.getElementById("BCEcheck").checked && ano > 0){
            ano = (-1)*ano+1
      }
      let anolux = 8000+ano
      if(mes<=2){
            anolux-= 1
      }
      let leap = 0
      let dia31 = 1
      let dia30 = 1
      let dia29 = 1
      if(resto(ano,4)==0){
            leap++
      }if(resto(ano,100)==0){
            leap--
      }if(resto(ano,400)==0){
            leap++
      }
      // Avalia a legalidade do dia 31, 30 e 29
      if(mes==2 ||mes==4 ||mes==6 ||mes==9 || mes==11){
            dia31 = 0
      }if(mes==2){
            dia30 = 0
      }if(mes==2 && leap==0){
            dia29 = 0
      }
      if(dia31==0 && dia == 31){
            dia = 30
      }
      if(dia30==0 && dia == 30){
            dia = 29
      }
      if(dia29==0 && dia == 29){
            dia = 28
      }
      let sgd = anolux*365+acumesesgregorianos[mes]+dia
      let residuo = parseInt(anolux/4)-parseInt(anolux/100)+parseInt(anolux/400)
      let sjd = sgd+sgdinicial+residuo
      let diadasemana = resto(sjd,7)

      let anostring = ano > 0 ? ano.toString().padStart(4, '0') + ' AD' : (1 - ano).toString().padStart(4, '0') + ' BCE';
   
      document.getElementById("datagregoriana").innerHTML= `${semanagregoriana[diadasemana]}, ${dia > 0 ? dia : '<span class="info" title="pridie kalendas">pk</span>'} ${mesesgregorianos[mes]} ${anostring.toString().padStart(4, '0')}`;
      document.getElementById("datajuliana").innerText = `Julian date at noon: ${(sjd).toLocaleString('fr-FR')}`;
      return sjd
}
function julianoparalunar(sjd) {
      let quantciclos = 0
      for(let i=0;i<60;i++){
            if(acuciclosjulianos[i]>=sjd){
                  quantciclos = i
                  i=60
            }
      }
    let swd = sjd - swdinicial;
    document.getElementById("dataswd").innerText = `SDW: ${swd.toLocaleString('fr-FR')}`;
    if (swd < 1) {
        document.getElementById("datalunar").innerText = "Date before epoch.";
        return "Date before epoch.";
    }
    let ciclocompleto = ciclodias;
    let ano = Math.floor(swd / anotropical) + 1;

    function obterswdinicialanual(ano) {
      let anociclo = ciclo(ano,cicloanos);
      if (anociclo == 0) {anociclo = cicloanos};
      let quantciclos = Math.floor((ano - 1) / cicloanos);
      return Math.floor(quantciclos * ciclocompleto) + acuanoslunares[anociclo] + acucicloslunares[quantciclos];
    }
    let swdinicialanual = obterswdinicialanual(ano);
    while (swd <= swdinicialanual && ano > 0) {
        ano--;
        swdinicialanual = obterswdinicialanual(ano);
    }
    while (swd > obterswdinicialanual(ano + 1)) {
        ano++;
        swdinicialanual = obterswdinicialanual(ano);
    }
    let swd_anual = swd - swdinicialanual;  // O erro está a partir daqui.
    let anociclo = resto(ano,cicloanos);
    if (anociclo === 0) {anociclo = cicloanos};
    let duracao = acuanoslunares[anociclo + 1] - acuanoslunares[anociclo];
    let leap = (duracao < 365) ? 0 : 1;
    let mes = 1;
    let current_day = 0;
    while (mes <= 12 + leap) {
        let m_days = (resto(mes,2) === 1) ? 30 : 29;
        if (mes === 12 && leap === 0 && duracao === 355) m_days = 30;
        //if (mes === 13 && leap === 1 && duracao === 383) m_days = 29; // anos de 383 dias foram abolidos.
        if (current_day + m_days >= swd_anual) {
            break;
        }
        current_day += m_days;
        mes++;
    }
      if (mes == 12 && acucicloslunaresmudou[quantciclos] == 1 && anociclo === cicloanos) {
        m_days = 30
      }
    if (mes > 12 + leap) {
        document.getElementById("datalunar").innerText = `swd_anual = ${swd_anual} not found: ${ano}-${mes}-${dia}.`;
        return `swd_anual = ${swd_anual} not found.`;
    }
    let dia = swd_anual - current_day;
    let semanal = resto(swd,7);

    document.getElementById("datalunar").innerHTML = `${semanalunar[semanal]}, ${dia > 0 ? dia : '<span class="info" title="pridie kalendas">pk</span>'} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} <span class="info" title="Joseph Justus Scaliger was the author of Sequencial Julian Day, with day zero at 24th November 4714 BCE. In this calendar day 1 is at 31st March 4713 BCE.">Scaliger Era</span>`;
    document.getElementById("datajuliana").innerText = `Julian date at noon: ${(sjd).toLocaleString('fr-FR')}`;
    let texto = `${semanalunar[semanal]}, ${dia > 0 ? dia : 'pk'} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} Scaliger Era`;
    console.log(texto)
    return texto;
}
function obtergregoriano(){
      ano = Number(document.getElementById('anolunar').value)
      mes = Number(document.getElementById('meslunar').value)
      dia = Number(document.getElementById('dialunar').value)
      return julianoparagregoriano(lunarparajuliano(ano,mes,dia))
}
function obterlunar(){
      ano = Number(document.getElementById('anogregoriano').value)
      mes = Number(document.getElementById('mesgregoriano').value)
      dia = Number(document.getElementById('diagregoriano').value)
      return julianoparalunar(gregorianoparajuliano(ano,mes,dia))
}
function converter(tipo,ano,mes,dia){
      if(tipo=="l"){
            return julianoparagregoriano(lunarparajuliano(ano,mes,dia))
      }else if(tipo=="g"){
            return julianoparalunar(gregorianoparajuliano(ano,mes,dia))
      }
      
}