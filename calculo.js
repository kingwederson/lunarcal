
function lunarparajuliano(ano,mes,dia){
      let ciclocompleto = 630773.377902213
      let sjdinicial = 261266 // para 3998 BCE | -46265 para 4839 BCE.
      let anociclo = ano%1727
      let duracao = acuanoslunares[anociclo+1]-acuanoslunares[anociclo]
      let leap
      let quantciclos = parseInt(ano/1727)
      let residuo = parseInt(quantciclos*0.377902212669142)
      let swd // dia sequencial do calendário lunissolar. Dia 1 é em 23 de março de 3998 B.C. (-3997).
      let semanal
      let sjd // dia sequencial da data juliana. Dia 0 é 24 de novembro d 4714 B.C. (-4713).
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
            dia = 29
      }
      if(dia < 1 || dia > 30){
            document.getElementById("datalunar").innerText = "This day is not allowed."
            return "This day is not allowed."
      }
      if(mes > 13){
            document.getElementById("datalunar").innerText = "This month number is not allowed."
            return "This month number is not allowed."
      }
      swd = parseInt(quantciclos*ciclocompleto)+acuanoslunares[anociclo]+acumeseslunares[mes]+dia+residuo
      sjd = swd+sjdinicial
      semanal = swd%7
      document.getElementById("datalunar").innerText = `${semanalunar[semanal]}, ${dia} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} → JD: ${parseInt(sjd).toLocaleString('fr-FR')} ¾ ± ½`
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
      let diadasemana
      if(sjd<0){
            diadasemana = (sjd+7000000)%7

      }else{
            diadasemana = sjd%7
      }

      //var dayStr = d < 10 ? '0' + d : d;
      //var monthStr = m < 10 ? '0' + m : m;
      let anostring = y > 0 ? y.toString().padStart(4, '0') : (1 - y).toString().padStart(4, '0') + ' BCE';

      document.getElementById("lunarparagregoriana").innerText = `${semanagregoriana[diadasemana]}, ${d} ${mesesgregorianos[m]} ${anostring.toString().padStart(4, '0')} → JD: ${parseInt(sjd).toLocaleString('fr-FR')} ½ ± ½`;

      return `${semanagregoriana[diadasemana]} ${anostring} ${mesesgregorianos[m]} ${d}`;
}
function gregorianoparajuliano(ano,mes,dia){
      let anoussher = 4000+ano
      if(mes<=2){
            anoussher-= 1
      }
      let sud = anoussher*365+acumesesgregorianos[mes]+dia
      let residuo = parseInt(anoussher/4)-parseInt(anoussher/100)+parseInt(anoussher/400)
      sjd = sud+260149+residuo
      let diadasemana = sjd%7

      let anostring = ano > 0 ? ano.toString().padStart(4, '0') : (1 - ano).toString().padStart(4, '0') + ' BCE';
   
      document.getElementById("datagregoriana").innerText = `${semanagregoriana[diadasemana]}, ${dia} ${mesesgregorianos[mes]} ${anostring.toString().padStart(4, '0')} → JD: ${parseInt(sjd).toLocaleString('fr-FR')} ½ ± ½`;
      return sjd
}
function julianoparalunar(sjd) {
    let swd = sjd - 261267;
    if (swd < 0) {
        document.getElementById("gregorianaparalunar").innerText = "Date before epoch.";
        return "Date before epoch.";
    }
    let ciclocompleto = 630773.377902213;
    let frac = 0.377902212669142;
    let ano = Math.floor(swd / 365.2425) + 1;

    function obterswdinicial(yr) {
        let ac = yr % 1727;
        if (ac === 0) ac = 1727;
        let qc = Math.floor(yr / 1727);
        let res = Math.floor(qc * frac);
        return Math.floor(qc * ciclocompleto) + acuanoslunares[ac] + res;
    }
    let swdinicialanual = obterswdinicial(ano);
    while (swd < swdinicialanual && ano > 0) {
        ano--;
        swdinicialanual = obterswdinicial(ano);
        console.log("repeti")
    }
    while (swd >= obterswdinicial(ano + 1)) {
        ano++;
        swdinicialanual = obterswdinicial(ano);
        console.log("repeti")
    }
    let day_of_year = swd - swdinicialanual + 1;
    let anociclo = ano % 1727;
    if (anociclo === 0) anociclo = 1727;
    let duracao = acuanoslunares[anociclo + 1] - acuanoslunares[anociclo];
    let leap = (duracao < 365) ? 0 : 1;
    let mes = 1;
    let current_day = 0;
    while (mes <= 12 + leap) {
        let m_days = (mes % 2 === 1) ? 30 : 29;
        if (mes === 12 && leap === 0 && duracao === 355) m_days = 30;
        if (mes === 13 && leap === 1 && duracao === 383) m_days = 29;
        if (current_day + m_days >= day_of_year) {
            break;
        }
        current_day += m_days;
        mes++;
    }
    if (mes > 12 + leap) {
        document.getElementById("grogorianadatalunar").innerText = "Invalid day of year.";
        return "Invalid day of year.";
    }
    let dia = day_of_year - current_day;
    let semanal = (swd+1) % 7;

    document.getElementById("gregorianaparalunar").innerText = `${semanalunar[semanal]}, ${dia} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')} → JD: ${parseInt(sjd).toLocaleString('fr-FR')} ¾ ± ½`;
    return `${semanalunar[semanal]}, ${dia} ${meseslunares[leap][mes]} ${ano.toString().padStart(4, '0')}`;
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