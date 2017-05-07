$(function() {
    function showError(text) {
        $('#alertErrorTemplate').clone()
            .attr('id', '')
            .removeClass('hidden')
            .find('.error-text').text(text).end()
            .insertAfter('#alertErrorTemplate');
    }

    var hideSuccessAlertTimeout;

    $('#form').submit(function(e) {
        e.preventDefault();

        var formData = {};
        jQuery.each($('#form').serializeArray(), function() {
            formData[this.name] = this.value;
        });

        var ttl = parseInt(formData.ttl, 10);
        if(isNaN(ttl)) delete formData.ttl;
        else formData.ttl = ttl * parseInt($('#selectTtlMultiplier').val(), 10);

        $('#buttonSubmit').prop('disabled', true);
        $.ajax({
            complete: function(jqxhr) {
                var data;
                try {
                    data = JSON.parse(jqxhr.responseText);
                } catch(e) {}

                if (data && data.success) {
                    $('#alertSuccess').fadeIn('fast');

                    if (hideSuccessAlertTimeout) clearTimeout(hideSuccessAlertTimeout);
                    hideSuccessAlertTimeout = setTimeout(function() {
                        $('#alertSuccess').fadeOut('fast');
                    }, 5000);
                } else {
                    var text = 'Error sending notification';
                    if (data && data.error) text += ': ' + data.error;
                    showError(text);
                }
                $('#buttonSubmit').prop('disabled', false);
            },
            contentType: 'application/json',
            data: JSON.stringify(formData),
            type: 'POST',
            url: '/stuhl'
        });
    });

    $('#alertSuccess').hide().removeClass('hidden');

    $.ajax({
        complete: function() {
            $('#alertLoading').addClass('hidden');
        },
        dataType: 'json',
        error: function() {
            showError('Error loading destinations');
        },
        success: function(data) {
            try {
                $('#selectDestination')
                    .empty()
                    .append($.map(data, function(dest) {
                        return $('<option></option>').text(dest);
                    }))
                $('#buttonSubmit').prop('disabled', false);
            } catch(e) {
                showError('Error during initialization');
            }
        },
        type: 'GET',
        url: '/destinations'
    });
});