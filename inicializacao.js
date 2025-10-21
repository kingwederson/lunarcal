// Executa o código após a página ser carregada para garantir que o elemento exista
window.addEventListener('load', function() {
      var hoje = new Date()
      var gregorianohoje = {
            ano: hoje.getFullYear(),
            mes: hoje.getMonth()+1,
            dia: hoje.getDate()
      }

      // Input Gregoriano
      const anogregorianohoje = document.getElementById('anogregoriano');
      const mesgregorianohoje = document.getElementById('mesgregoriano');
      const diagregorianohoje = document.getElementById('diagregoriano');

      // Input Masaic

      const anomosaicohoje = document.getElementById('anomosaico');

      // Define a opção com o valor como a selecionada
      anogregorianohoje.value = `${gregorianohoje.ano}`;
      mesgregorianohoje.value = `${gregorianohoje.mes}`;
      diagregorianohoje.value = `${gregorianohoje.dia}`;

      anomosaicohoje.value = `${gregorianohoje.ano + 3959}`;

      ssd_para_mosaico(gregoriano_para_ssd(gregorianohoje.ano,gregorianohoje.mes,gregorianohoje.dia))
      ssd_para_juliano(gregoriano_para_ssd(gregorianohoje.ano,gregorianohoje.mes,gregorianohoje.dia))
      ssd_para_jdn(gregoriano_para_ssd(gregorianohoje.ano,gregorianohoje.mes,gregorianohoje.dia))
      ssd_para_gregoriano(gregoriano_para_ssd(gregorianohoje.ano,gregorianohoje.mes,gregorianohoje.dia))
      
});