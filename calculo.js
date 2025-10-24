function resto(dividendo,divisor){
      return (dividendo%divisor+divisor)%divisor
}
function ciclo(dividendo,divisor){
      dividendo--;
      return 1+(dividendo%divisor+divisor)%divisor
}
function diadasemana(ssd){
      return resto(ssd+2,7)
}
function numerodedias(ano,embs,ciclo,shift){
      let resto = ( 1 + ( ano + shift ) * embs ) % ciclo;
      return resto < embs ? 384 : 354;
}

var dataslog = {
      gregorian:{
            ano: 1993,
            mes: 3,
            dia: 4
      },
      julian:{
            ano: 1993,
            mes: 2,
            dia: 19
      },
      mosaic:{
            ano: 6705,
            mes: 13,
            dia: 11
      },
      jdn: 2449051
}

const cicloanos = 10364
const ciclomeses = 21360
const anotropical = 365.2421896698
const messinodico = 29.530588853
const ciclodias = ciclomeses*messinodico
const swdinicial = -611 // para 3998 BCE | -46265 para 4839 BCE.
const sgdinicial = -32045
const sjdinicial = -32080
const jdninicial = 0


function mosaico_para_ssd(ano,mes,dia){
      ano += 756
      let ciclocompleto = ciclodias
      let anociclo = ciclo(ano,cicloanos);
      let duracao = acuanoslunares[anociclo+1]-acuanoslunares[anociclo]
      let leap
      let quantciclos = Math.floor((ano - 1) / cicloanos);
      let swd // dia sequencial do calendário lunissolar.
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
      ssd = swd+swdinicial/*
      if(ano < 1){
            document.getElementById("datamosaica").innerText = "Date before epoch.";
      }else{
            document.getElementById("datamosaica").innerHTML = `${semanalunar[semanal]}, ${dia > 0 ? dia : '<span class="info" title="pridie kalendas">pk</span>'} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} <span class="info" title="Joseph Justus Scaliger was the author of Sequencial Julian Day, with day zero at 24th November 4714 BCE. In this calendar day 1 is at 31st March 4713 BCE.">Scaliger Era</span>`
      }*/
      return parseInt(ssd)
}
function ssd_para_mosaico(ssd) {
      let quantciclos = 0
      for(let i=0;i<60;i++){
            if(acuciclosjulianos[i]>=ssd){
                  quantciclos = i
                  i=60
            }
      }
    let swd = ssd - swdinicial;
    if (swd < 1) {
        document.getElementById("datamosaica").innerText = "Date out of range data.";
        return "Date out of range data.";
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
        if (mes === 13 && leap === 1 && duracao === 383) m_days = 29;
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
        //document.getElementById("datamosaica").innerText = `swd_anual = ${swd_anual} not found: ${ano}-${mes}-${dia}.`;
        return `swd_anual = ${swd_anual} not found.`;
    }
    let dia = swd_anual - current_day;

    ano -= 756

    let complemento
    if(ano <= 0){
      complemento = 'Before Epoch'
      ano = (-1)*ano+1
    }else if(ano > 0){
      complemento = 'AM'
    }

      //document.getElementById("anomosaico").value = ano
      //document.getElementById("mesmosaico").value = mes
      //document.getElementById("diamosaico").value = dia

    document.getElementById("datamosaica").innerHTML = `${semana[diadasemana(ssd)]}, ${dia > 0 ? dia : '<span class="info" title="pridie kalendas">pk</span>'} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} ${complemento}`;
}
function juliano_para_ssd(ano, mes, dia) {
    if(document.getElementById("BCEjuliano").checked && ano > 0){
        ano = (-1)*ano+1
    }
    // Algoritmo clássico para JDN juliano
    let A = Math.floor((14 - mes) / 12);
    ano = ano + 4800 - A;
    mes = mes + 12 * A - 3;
    let B = Math.floor((153 * mes + 2) / 5)
    let C = Math.floor(ano / 4)
    let D = - 32083
    let ssd = dia + B + 365 * ano + C + D;

    return ssd;
}
function ssd_para_juliano(ssd) {
      let J = ssd; // Se precisar ajustar para midnight, teste J = ssd + 0.5;
      let Z = Math.floor(J);
      let F = J - Z;

      let A = Z;

      let B = A + 1524;
      let C = Math.floor((B - 122.1) / 365.25);
      let D = Math.floor(365.25 * C);
      let E = Math.floor((B - D) / 30.6001);

      let dia = Math.floor(B - D - Math.floor(30.6001 * E) + F); // Arredonda para dia inteiro
      let mes = (E < 14) ? (E - 1) : (E - 13); // Simplifiquei removendo a atribuição redundante

      let ano = (mes > 2) ? (C - 4716) : (C - 4715); // Simplifiquei o if

      let anostring = ano > 0 ? ano.toString().padStart(4, '0') + ' AD' : (1 - ano).toString().padStart(4, '0') + ' BCE';

      let comentario = ssd > 2299161 ? '<small>(date after Gregorian reform)<small>' : '';

      //document.getElementById("anojuliano").value = ano
      //document.getElementById("mesjuliano").value = mes
      //document.getElementById("diajuliano").value = dia

      // Se preferir atualizar o HTML, use isso em vez do return:
      document.getElementById("datajuliana").innerHTML = `${semana[diadasemana(ssd)]}, ${dia} ${mesesjulianos[mes]} ${anostring} ${comentario}`;
}
function gregoriano_para_ssd(ano,mes,dia){
      if(document.getElementById("BCEgregoriano").checked && ano > 0){
            ano = (-1)*ano+1
      }
      let anolux = 4800+ano
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
      let ssd = sgd+sgdinicial+residuo

      //let anostring = ano > 0 ? ano.toString().padStart(4, '0') + ' AD' : (1 - ano).toString().padStart(4, '0') + ' BCE';
   
      //document.getElementById("datagregoriana").innerHTML= `${semanagregoriana[diadasemana]}, ${dia > 0 ? dia : '<span class="info" title="pridie kalendas">pk</span>'} ${mesesgregorianos[mes]} ${anostring.toString().padStart(4, '0')}`;
      return ssd;
}
function ssd_para_gregoriano(ssd) {
      let l = Math.floor(ssd) + 68569;
      let n = Math.floor(4 * l / 146097);
      l = l - Math.floor((146097 * n + 3) / 4);
      let i = Math.floor(4000 * (l + 1) / 1461001);
      l = l - Math.floor(1461 * i / 4) + 31;
      let j = Math.floor(80 * l / 2447);
      let dia = l - Math.floor(2447 * j / 80);
      l = Math.floor(j / 11);
      let mes = j + 2 - 12 * l;
      let ano = 100 * (n - 49) + i + l;

      //var dayStr = d < 10 ? '0' + d : d;
      //var monthStr = m < 10 ? '0' + m : m;
      let anostring = ano > 0 ? ano.toString().padStart(4, '0') + ' AD' : (1 - ano).toString().padStart(4, '0') + ' BCE';
      let comentario = ssd <= 2299161 ? '<small>(date before Gregorian reform)<small>' : '';

      //document.getElementById("anogregoriano").value = ano
      //document.getElementById("mesgregoriano").value = mes
      //document.getElementById("diagregoriano").value = dia

      document.getElementById("datagregoriana").innerHTML = `${semana[diadasemana(ssd)]}, ${dia} ${mesesgregorianos[mes]} ${anostring.toString().padStart(4, '0')} ${comentario}`;
}
function jdn_para_ssd(jdn){
      let ssd = jdn
      return ssd
}
function ssd_para_jdn(ssd){
      let jdn = ssd
      document.getElementById("datajdn").innerText = `Julian Day Number: ${(jdn).toLocaleString('fr-FR')}`;
}
function deMOSAICO(){
      ano = Number(document.getElementById('anomosaico').value)
      mes = Number(document.getElementById('mesmosaico').value)
      dia = Number(document.getElementById('diamosaico').value)
      ssd_para_mosaico(mosaico_para_ssd(ano,mes,dia))
      ssd_para_juliano(mosaico_para_ssd(ano,mes,dia))
      ssd_para_gregoriano(mosaico_para_ssd(ano,mes,dia))
      ssd_para_jdn(mosaico_para_ssd(ano,mes,dia))
}
function deJULIANO(){
      ano = Number(document.getElementById('anojuliano').value)
      mes = Number(document.getElementById('mesjuliano').value)
      dia = Number(document.getElementById('diajuliano').value)
      ssd_para_mosaico(juliano_para_ssd(ano,mes,dia))
      ssd_para_juliano(juliano_para_ssd(ano,mes,dia))
      ssd_para_gregoriano(juliano_para_ssd(ano,mes,dia))
      ssd_para_jdn(juliano_para_ssd(ano,mes,dia))
}
function deGREGORIANO(){
      ano = Number(document.getElementById('anogregoriano').value)
      mes = Number(document.getElementById('mesgregoriano').value)
      dia = Number(document.getElementById('diagregoriano').value)
      ssd_para_mosaico(gregoriano_para_ssd(ano,mes,dia))
      ssd_para_juliano(gregoriano_para_ssd(ano,mes,dia))
      ssd_para_gregoriano(gregoriano_para_ssd(ano,mes,dia))
      ssd_para_jdn(gregoriano_para_ssd(ano,mes,dia))
}
function deJDN(){
      jdn = Number(document.getElementById('numerodiajuliano').value)
      ssd_para_mosaico(jdn_para_ssd(jdn))
      ssd_para_juliano(jdn_para_ssd(jdn))
      ssd_para_gregoriano(jdn_para_ssd(jdn))
      ssd_para_jdn(jdn_para_ssd(jdn))
}
function converter(tipo,ano,mes,dia){
      if(tipo=="m"){
            return ssd_para_gregoriano(mosaico_para_ssd(ano,mes,dia))
      }else if(tipo=="g"){
            return ssd_para_mosaico(gregoriano_para_ssd(ano,mes,dia))
      }else if(tipo=="j"){
            return ssd_para_mosaico(juliano_para_ssd(ano,mes,dia))
      }
     
}