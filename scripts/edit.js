function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are 0-based
    const year = d.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

$('input[name="daterange"]').daterangepicker({
    "minDate": formatDate(Date.now()),
    "autoApply": true,
    "locale": {
        "format": "DD/MM/YYYY",
        "separator": "       |       ",
        "fromLabel": "de",
        "toLabel": "até",
        "weekLabel": "W",
        "daysOfWeek": [
            "Dom",
            "Seg",
            "Ter",
            "Qua",
            "Qui",
            "Sex",
            "Sab"
        ],
        "monthNames": [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ],
        "firstDay": 1
    }
}, function(start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});

function changeEditDate(selectedIndex) {
    const buttons = document.querySelectorAll('.dia-item');

    buttons.forEach((button, index) => {
        if (index === selectedIndex) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}