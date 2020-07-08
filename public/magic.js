$(document).ready(function(){
    $("form#exchange").on('submit', function(e){
        e.preventDefault();
        var data = $('input[name=weight]').val();
        $.ajax({
            type: 'post',
            url: '/ajax',
            data: data,
            dataType: 'text'
        })
        .done(function(data){
            $('h1').html(data.weight);
        });
    });
});