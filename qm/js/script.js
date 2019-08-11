$(document).ready(function () {
    $("#tabs").tabs();

    $('#thickness_edited_value').addClass('is-mm');
    //,#width_edited_value,#length_edited_value,#gap_edited_value
    $('#thickness').change(function () {
        $('#thickness_edited_value').show();
        if ($('input[name="rdoUnit"]:checked').val() == 'inch')
            $('#thickness_edited_value').val($(this).find('option:selected').attr('data-inch'));
        else
            $('#thickness_edited_value').val($(this).find('option:selected').attr('data-mm'));
        if ($(this).val() == "")
            $('#thickness_edited_value').hide().val('');
    });
    /*$('#width').change(function () {
        $('#width_edited_value').show();
        if ($('input[name="rdoUnit"]:checked').val() == 'inch')
            $('#width_edited_value').val($(this).find('option:selected').attr('data-inch'));
        else
            $('#width_edited_value').val($(this).find('option:selected').attr('data-mm'));
        if ($(this).val() == "")
            $('#width_edited_value').hide().val('');
    });
    $('#length').change(function () {
        $('#length_edited_value').show();
        if ($('input[name="rdoUnit"]:checked').val() == 'inch')
            $('#length_edited_value').val($(this).find('option:selected').attr('data-inch'));
        else
            $('#length_edited_value').val($(this).find('option:selected').attr('data-mm'));
        if ($(this).val() == "")
            $('#length_edited_value').hide().val('');
    });
    $('#gap').change(function () {
        $('#thickness_edited_value').show();
        if ($('input[name="rdoUnit"]:checked').val() == 'inch')
            $('#gap_edited_value').val($(this).find('option:selected').attr('data-inch'));
        else
            $('#gap_edited_value').val($(this).find('option:selected').attr('data-mm'));
        if ($(this).val() == "")
            $('#gap_edited_value').hide().val('');
    });
*/
//,#width_edited_value,#length_edited_value,#gap_edited_value
    $('#thickness_edited_value').keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode == 46) {
            //Check if the text already contains the . character
            if ($(this).val().indexOf('.') === -1) {
                return true;
            } else {
                return false;
            }
        } else {
            if (charCode > 31
                    && (charCode < 48 || charCode > 57))
                return false;
        }
        return true;
    })
    $('#thickness_edited_value').blur(function () {
        var value = parseFloat($(this).val());
        if (!isNaN(value)) {
            $(this).val(parseFloat(value).toFixed(1));
        }
        $('#thickness_edited_value').val($(this).val());
    });
   /* $('#width_edited_value,#length_edited_value,#gap_edited_value').blur(function () {
        var value = Math.round($(this).val());
        if (!isNaN(value)) {
            $(this).val(Math.round(value));
        }
        $(this).siblings('select').val($(this).val());
    });*/

    //setDropDownValues(1,50,'width');
    //setDropDownValues(1,50,'length');
    $('#loading').hide();
    $('.error-msg').text('');
    $('input[name="shape"]').click(function () {
        $('.error-msg').text('');
        $("#lblResult").empty().text('');
        $('#grade, #thickness, #gap, #width, #length').removeClass('border-error');
        //$('#thickness, #gap, #width, #length').val('');
        //$('#grade').prop('selectedIndex', 0);
        $('#grade').change();
        $('#magnetShap').removeClass('text-danger');
        $('#lbl-width').text('Width');
        $('#lbl-length').text('Length');
        $('.shape.selected').removeClass('selected');
        $('.shape.img-selected').removeClass('img-selected');
        $(this).next('label').children('span').addClass('selected');
        $(this).next('label').children('img').addClass('img-selected')
        $('#length,#lbl-length,#div-length').show();
        $('#length').attr('required', 'true');
        var old_width = $('#width :selected').val();
        setDropDownValues(1, 50, 'width');
        var old_length = $('#length :selected').val();
        setDropDownValues(1, 50, 'length');
        $('#gap option[value="0.12"]').show();
        $("#div-length").removeClass('ID');
        $("#div-width").removeClass('OD');
        if ($('.shape.selected').data('name') == 'ring')
        {
            $('#lbl-width').text('OD');
            $('#lbl-length').text('ID');
            $("#div-length").addClass('ID');
            $("#div-width").addClass('OD');
            setDropDownValues((old_length ? (parseInt(old_length) + 1) : 2), 50, 'width');
            setDropDownValues(1, 49, 'length');
        } else if ($('.shape.selected').data('name') == 'cylinder')
        {
            $('#lbl-width').text('Diameter ');
            $('#length,#lbl-length,#div-length').removeAttr('required').hide();
            $('#length').val('');
            $('#gap option[value="0.12"]').hide();
        }
        $('#width').val(old_width);
        $('#length').val(old_length);
    });
    $('input[name="condition"]').click(function () {
        $('.error-msg').text('');
        $("#lblResult").empty().text('');
        $('#grade, #thickness, #gap, #width, #length').removeClass('border-error');
        //$('#grade, #thickness, #gap, #width, #length').val('');
        $('#coldrolledcondition').removeClass('text-danger');
        $('.condition.selected').removeClass('selected');
        $('.condition.img-selected').removeClass('img-selected');
        $(this).next('label').children('span').addClass('selected');
        $(this).next('label').children('img').addClass('img-selected')
    });
});
$(document).on('click', "#btnSubmit", function (event) {
    $('#magnetShap, #coldrolledcondition').removeClass('text-danger');
    $('.error-msg').text('');
    $('#grade, #inp_bar, #thickness, #gap, #width, #length').removeClass('border-error');
    shap = $('.shape.selected').data('name');
    if ($('.shape.selected').data('name') == undefined)
    {
        $('#magnetShap').addClass('text-danger');
        $('.error-msg').text('Please select magnet shape.');
        return false;
    }
    if ($('.condition.selected').data('name') == undefined)
    {
        $('#coldrolledcondition').addClass('text-danger');
        $('.error-msg').text('Please select condition of Steel Condition.');
        return false;
    }
    if (!GradeOrBarValidation())
        return false;


    if($('#thickness_edited_value').val() != "" && parseFloat($('#thickness_edited_value').val()) >25)
    {
        $('#thickness').addClass('border-error');
        $('.error-msg').text('Thickness should not be greater that 25');
        return false;
    }

    $('#thickness :selected').val($('#thickness_edited_value').val())
    thickness = $('#thickness :selected').val(); //getExactValues($('#thickness_edited_value').val());//
    if (thickness == '')
    {
        $('#thickness').addClass('border-error');
        $('.error-msg').text('Please select Thickness.');
        return false;
    }
    width = $('#width :selected').val(); //getExactValues($('#width_edited_value').val());
    if (width == '')
    {
        $('#width').addClass('border-error');
        $('.error-msg').text('Please select ' + $('#lbl-width').text() + '.');
        return false;
    }
    if (shap != 'cylinder' && shap != undefined) {
        height = $('#length :selected').val();//getExactValues($('#length_edited_value').val());//
        if (height == '')
        {
            $('#length').addClass('border-error');
            $('.error-msg').text('Please select ' + $('#lbl-length').text() + '.');
            return false;
        }
    }
    gap = $('#gap :selected').val(); //$('#gap_edited_value').val();//
    if (gap == '')
    {
        $('#gap').addClass('border-error');
        $('.error-msg').text('Please select Gap to steel.');
        return false;
    }
    return true;
});
var res_Json = null;
$(document).on('submit', "#calculator-form", function (event) {
    event.preventDefault();
    $('#graph').html('');
    $('#btnSubmit').button('loading');
    $('#btnSubmit').attr('disabled', 'disabled');
    $('.error-msg').text('');
    $('#magnetShap, #coldrolledcondition, #width, #length, #thickness, #gap').removeClass('text-danger');
    if ($('.shape.selected').data('name') != undefined)
        shap = $('.shape.selected').data('name');
    else
    {
        $('#magnetShap').addClass('text-danger');
        $('.error-msg').text('Please select magnet shape.');
        return false;
    }

    if ($('.condition.selected').data('name') != undefined)
        condition = $('.condition.selected').data('name');
    else
    {
        $('#coldrolledcondition').addClass('text-danger');
        $('.error-msg').text('Please select condition of Steel Condition.');
        return false;
    }
    grade = ($('#grade :selected').val() == undefined || $('#grade :selected').val() == '') ? 'N52' : $('#grade :selected').val();
    thickness = getExactValues($('#thickness_edited_value').val());//$('#thickness :selected').val();
    gap = $('#gap :selected').val(); //getExactValues($('#gap_edited_value').val()); //
    bar_val = $('#inp_bar').val();
    bar_type = ($('input[name="rdoBar"]:checked').val() == 'T' ? 1 : 2);
    if (shap == 'cylinder')
        diameter = $('#width :selected').val();//getExactValues($('#width_edited_value').val());//
    else {
        width = $('#width :selected').val();//getExactValues($('#width_edited_value').val());//
        height = $('#length :selected').val();//getExactValues($('#length_edited_value').val());//
    }
    url = "calculator.php";
    var get = '';
    if (shap == 'cylinder')
    {
        get = $.get(url, {grade: grade, magnet: shap, condition: condition, diameter: diameter, thickness: thickness, gap: gap, bar_val: bar_val, bar_type: bar_type});

    } else
    {
        get = $.get(url, {grade: grade, magnet: shap, condition: condition, width: width, height: height, thickness: thickness, gap: gap, bar_val: bar_val, bar_type: bar_type});
    }
    get.done(function (data) {
        $('#btnSubmit').button('reset');
        $('#btnSubmit').removeAttr('disabled');
        data = $.parseJSON(data);
        if (data.status == 200)
        {
            res_Json = data;
            $("#lblResult").empty();
            convertResult(data.value, true);
            $("#lblResult").attr('data-val', data.value);
            if (data.graphArray.length > 0)
            {
                //$('#myChart').show().removeClass('hide');
                //draw(data.graphArray,data.value,false);
            }
        } else
        {
            $("#lblResult").empty().text(0);
            resetChart();
        }
    });
});
function getExactValues(value)
{
    if ($('input[name="rdoUnit"]:checked').val() == 'inch')
    {
        var res = (parseFloat(value) * 25.4).toFixed(1);
            return res % 1 > 0 ? res : Math.round(res);
        //return (parseFloat(value) / 25.4).toFixed(5);
    }
    return value;
}
$(document).on('change', '#thickness, #gap, #width, #length', function (event) {
    $("#lblResult").empty().text('');
    $('.error-msg').text('');
    resetChart();
});
/*var chartDrawn = false;
 var pointIndex = 0;

 var scatterChart = null;*/
function draw(grpArray, force, islbs)
{
    var output = [];
    console.log(force);
    var isInch = ($('input[name="rdoUnit"]:checked').val() == 'inch');
    $.each(grpArray, function (ind, val) {
        if (parseFloat($('#gap :selected').val()).toFixed(2) == parseFloat(val.gap).toFixed(2))
        {
            //output.push({x: parseFloat(isInch ? (val.gap / 25.4).toFixed(5) : val.gap), y: parseFloat(islbs ? (val.force / 4.448).toFixed(2) : parseFloat(val.force).toFixed(2)), marker: {enabled: true, fillColor: '#FF0000', lineWidth: 3, lineColor: "#FF0000"}});
            output.push({x: parseFloat(isInch ? (val.gap / 25.4).toFixed(5) : val.gap), y: parseFloat(islbs ? (force / 4.448).toFixed(2) : parseFloat(force).toFixed(2)), marker: {enabled: true, fillColor: '#FF0000', lineWidth: 3, lineColor: "#FF0000"}});

        } else
            output.push({x: parseFloat(isInch ? (val.gap / 25.4).toFixed(5) : val.gap), y: parseFloat(islbs ? (val.force / 4.448).toFixed(2) : parseFloat(val.force).toFixed(2)), marker: {enabled: true}});
    });
    var interval = 1;
    if (grpArray[0].force < 5 && grpArray[0].force > 0)
        interval = 0.1;
    if (grpArray[0].force < 10 && grpArray[0].force > 5)
        interval = 1;
    if (grpArray[0].force < 25 && grpArray[0].force > 10)
        interval = 1.5;
    if (grpArray[0].force < 50 && grpArray[0].force > 25)
        interval = 5;
    if (grpArray[0].force < 100 && grpArray[0].force > 50)
        interval = 15;
    if (grpArray[0].force > 200)
        interval = 25;
    if (grpArray[0].force > 500)
        interval = 50;
    if (grpArray[0].force > 800)
        interval = 100;
    Highcharts.chart('graph', {
        /*chart: {
         type: 'spline',
         inverted: true
         },*/
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            reversed: false,
            title: {
                enabled: true,
                text: 'Gap ' + (isInch ? '(inch)' : '(mm)')
            },
            lineWidth: 1,
            labels: {
                step: 1
            },
            showLastLabel: false,
            gridLineColor: '#fcfcfc',
            tickInterval: (isInch ? 0.1 : 1),
            showLastLabel: true,
            endOnTick: true,
            max: (isInch ? output[output.length - 1].x : 15),
        },
        yAxis: {
            title: {
                text: 'Force ' + (islbs ? '(LBS)' : '(N)')
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            lineWidth: 1,
            tickInterval: interval,
            gridLineColor: '#fcfcfc',
            startOnTick: true,
            endOnTick: true
        },
        legend: {
            enabled: true
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x} [Gap]: {point.y} ' + (islbs ? '(LBS)' : '(N)')
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: true
                }
            }
        },
        series: [{
                showInLegend: false,
                name: 'Gap ' + (isInch ? '(inch)' : '(mm)'),
                data: output
            }]
    });

}
function resetChart()
{
    scatterChart = null;
    $('#graph').empty();
    chartDrawn = false;
    res_Json = null;
}
$(document).on('change', '#grade', function (event) {
    $("#lblResult").empty().text('');
    $('.error-msg').text('');
    if ($(this).val().length > 0)
    {
        $('#grade').attr('required', true);
        $('.select-grade').css('color', '#333');
        $('input[name="rdoBar"]').prop('checked', false);
        $('#inp_bar').val('').attr('disabled', 'disabled').removeClass('border-error');
        $('.select-bar').css('color', '#efefef');
    } else
    {
        $('.select-bar').css('color', '#333');
        $('.select-grade').css('color', '#efefef');
        $('input[name="rdoBar"]').removeAttr('disabled');
    }
    resetChart();
});
$(document).on('click', 'input[name="rdoBar"]', function (event) {
    $('.select-grade').css('color', '#efefef');
    $('.select-bar').css('color', '#333');
    $('input[name="rdoBar"], #inp_bar').removeAttr('disabled');
    $('#grade').removeClass('border-error').removeAttr('required').val('');
    $('#inp_bar').removeAttr('disabled').val('');
    if ($('input[name="rdoBar"]:checked').val() == 'T')
        $('#inp_bar').attr('min', '0.0000').attr('max', '1.6000').attr('step', '0.0001');
    else
        $('#inp_bar').attr('min', '1000').attr('max', '50000');
});

$(document).on('click', 'input[name="rdoUnit"]', function (event) {
    var isChange = false;
    if ($('input[name="rdoUnit"]:checked').val() == 'inch')
    {
        $('.custom-dropdown').removeClass('custom-dropdown-mm').addClass('custom-dropdown-inch');
        $('.dropdown-toggle >option').each(function () {
            $(this).text($(this).attr('data-inch'));
            if (!isChange)
            {
                if ($('#thickness_edited_value').hasClass('is-mm'))
                {
                    if (parseFloat($('#thickness_edited_value').val()) % 1 > 0)
                        $('#thickness_edited_value').val((parseFloat($('#thickness_edited_value').val()) / 25.4).toFixed(5));
                    else
                        $('#thickness_edited_value').val($('#' + $(this).parent('select').attr('id') + ' option:selected').attr('data-inch'));
                }
                /*if ($('#width_edited_value').hasClass('is-mm'))
                {
                    if (parseFloat($('#width_edited_value').val()) % 1 > 0)
                        $('#width_edited_value').val((parseFloat($('#width_edited_value').val()) / 25.4).toFixed(5));
                    else
                        $('#width_edited_value').val($('.wdt option:selected').attr('data-inch'));
                }
                if ($('#length_edited_value').hasClass('is-mm'))
                {
                    if (parseFloat($('#length_edited_value').val()) % 1 > 0)
                        $('#length_edited_value').val((parseFloat($('#length_edited_value').val()) / 25.4).toFixed(5));
                    else
                        $('#length_edited_value').val($('.len option:selected').attr('data-inch'));
                }
                if ($('#gap_edited_value').hasClass('is-mm'))
                {
                    if (parseFloat($('#gap_edited_value').val()) % 1 > 0)
                        $('#gap_edited_value').val((parseFloat($('#gap_edited_value').val()) / 25.4).toFixed(5));
                    else
                        $('#gap_edited_value').val($('.gap option:selected').attr('data-inch'));
                }*/
                $('#thickness_edited_value').removeClass('is-mm').addClass('is-inch');
                //,#width_edited_value,#length_edited_value,#gap_edited_value
                isChange = true;
            }
        });
    } else
    {
        $('.custom-dropdown').removeClass('custom-dropdown-inch').addClass('custom-dropdown-mm');
        $('.dropdown-toggle >option').each(function () {
            $(this).text($(this).attr('data-mm'));
            if (!isChange)
            {
                var res = (parseFloat($('#thickness_edited_value').val()) * 25.4).toFixed(1);
                if ($('#thickness_edited_value').hasClass('is-inch'))
                    $('#thickness_edited_value').val(res % 1 > 0 ? res : Math.round(res));

                /*res = (parseFloat($('#width_edited_value').val()) * 25.4).toFixed(1);
                if ($('#width_edited_value').hasClass('is-inch'))
                    $('#width_edited_value').val(res % 1 > 0 ? res : Math.round(res));

                res = (parseFloat($('#length_edited_value').val()) * 25.4).toFixed(1);
                if ($('#length_edited_value').hasClass('is-inch'))
                    $('#length_edited_value').val(res % 1 > 0 ? res : Math.round(res));

                res = (parseFloat($('#gap_edited_value').val()) * 25.4).toFixed(1);
                if ($('#gap_edited_value').hasClass('is-inch'))
                    $('#gap_edited_value').val(res % 1 > 0 ? res : Math.round(res));*/
                $('#thickness_edited_value').removeClass('is-inch').addClass('is-mm');
                //,#width_edited_value,#length_edited_value,#gap_edited_value
                isChange = true;
            }
        });
    }
    resetChart();
});

function GradeOrBarValidation()
{
    grade = $('#grade :selected').val();
    if (!$('input[name="rdoBar"]').is(':checked') && grade == '')
    {
        $('#grade').addClass('border-error');
        $('.error-msg').text('Please select Magnet grade.');
        return false;
    }
    if ($('input[name="rdoBar"]').is(':checked') && $('#inp_bar').val().length <= 0)
    {
        $('#inp_bar').addClass('border-error');
        $('.error-msg').text('Please add some value in Input Br.');
        return false;
    }
    return true;
}
$(document).on('keypress', '#inp_bar', function (evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if ($('input[name="rdoBar"]:checked').val() == 'T')
    {
        if (
                (charCode != 45 || $(this).val().indexOf('-') != -1) && // â€œ-â€ CHECK MINUS, AND ONLY ONE.
                (charCode != 46 || $(this).val().indexOf('.') != -1) && // â€œ.â€ CHECK DOT, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
            return false;

        return true;
    } else if ($('input[name="rdoBar"]:checked').val() == 'Guass')
    {
        if (
                (charCode != 45 || $(this).val().indexOf('-') != -1) && // â€œ-â€ CHECK MINUS, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

});
$(document).on('click', 'input[name="rdoResUnit"]', function (event) {
    $('input[name="rdoResUnit"]').removeAttr('disabled');
    $(this).attr('disabled', 'disabled');
    convertResult(0, false);
});

function convertResult(res_val, isDirect)
{
    //if (!($('input[name="rdoResUnit"]:checked').val() == 'N' && isDirect))
    {
        if (!isNaN(parseFloat($('#lblResult').text())))
        {
            if ($('input[name="rdoResUnit"]:checked').val() == 'N' && !isDirect)
            {
                //$("#lblResult").text((parseFloat($('#lblResult').text())*4.448).toFixed(2));
                $("#lblResult").text($('#lblResult').attr('data-val'));
                if (res_Json && res_Json.graphArray.length > 0)
                    draw(res_Json.graphArray, res_Json.value, false);
            } else
            {
                $("#lblResult").text((parseFloat($('#lblResult').text()) / 4.448).toFixed(2));
                if (res_Json && res_Json.graphArray.length > 0)
                    draw(res_Json.graphArray, res_Json.value, true);
                //$("#lblResult").text($('#lblResult').data('val'));
            }
        } else
        {
            $('input[name="rdoResUnit"]:checked').val() == 'N' ? $("#lblResult").text(res_val) : $("#lblResult").text((res_val / 4.448).toFixed(2));
            draw(res_Json.graphArray, res_Json.value, ($('input[name="rdoResUnit"]:checked').val() == 'N' ? false : true));
        }
    }
}
$(document).on('change', "#length", function (event) {
    if ($('.shape.selected').data('name') == 'ring' && $('#length :selected').val() != '')
    {
        setDropDownValues(parseInt($('#length :selected').val()) + 1, 50, 'width');
    }
});
function setDropDownValues(start, end, id)
{
    var isInch = ($('input[name="rdoUnit"]:checked').val() == 'inch');
    $('#' + id).empty().append('<option value=""></option>');
    for (i = start; i <= end; i++)
    {
        var option = '<option value="' + i + '" data-mm="' + i + '" data-inch="' + (i / 25.4).toFixed(5) + '">' + (isInch ? (i / 25.4).toFixed(5) : i) + '</option>';
        $('#' + id).append(option);
    }
}


//Code for Load Line or Permeance Coefficient & Demagnetizing Factor
$(document).on('click', 'input[name="accordion-group"]', function () {
    $('#accordion div.option input.form-control').removeClass('border-error').val('');
    $('.error-msg-tab2, #lblResult-Pc-tab2, #lblResult-N-tab2').text('');
});
$(document).on('click', 'input[name="rdoUnit-tab2"]', function () {
    $('#accordion div.option input.form-control').removeClass('border-error').each(function () {
        if ($(this).val() !== '') {
            if ($('input[name="rdoUnit-tab2"]:checked').val() === 'inch')
            {
                $(this).attr('min', '0.00000').attr('max', $(this).hasClass('thk') ? '1.96850' : '3.93701').attr('step', '0.00001');
                $(this).val(parseInt($(this).val()) < ($(this).hasClass('thk') ? 50 : 100) ? (parseInt($(this).val()) / 25.4).toFixed(5) : ($(this).hasClass('thk') ? 1.96850 : 3.93701));
            } else if ($('input[name="rdoUnit-tab2"]:checked').val() === 'mm')
            {
                $(this).attr('min', '1').attr('max', $(this).hasClass('thk') ? '50' : '100').attr('step', '1');
                $(this).val(parseFloat($(this).val()) < ($(this).hasClass('thk') ? 1.96850 : 3.93701) ? Math.round(parseFloat($(this).val()) * 25.4) : ($(this).hasClass('thk') ? 50 : 100));
            }
        }
    });
    $('.error-msg-tab2, #lblResult-Pc-tab2, #lblResult-N-tab2').text('');
});
$(document).on('click', '#btnSubmit-tab2', function () {
    if (!$('input[name="accordion-group"]').is(':checked'))
    {
        showError('Please select option from above');
    } else
    {
        showError('');
        var thk = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? 1.96850 : 50;
        var nonThk = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? 3.93701 : 100;
        if ($('input[name="accordion-group"]:checked').val() == 'opt1')
        {
            checkOpt1Rectangular(thk, nonThk);
        } else if ($('input[name="accordion-group"]:checked').val() == 'opt2')
        {
            CheckOpt2Ring(thk, nonThk);
        } else if ($('input[name="accordion-group"]:checked').val() == 'opt3')
        {
            checkOpt3Cylinder(thk, nonThk);
        }
    }
});
function checkOpt1Rectangular(min, max)
{
    $('#opt1-length, #opt1-thickness, #opt1-width').removeClass('border-error');
    var thickness = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt1-thickness').val()) : parseInt($('#opt1-thickness').val());
    if (isNaN(thickness))
    {
        showError('Please Enter valid Thickness value.');
        $('#opt1-thickness').addClass('border-error');
        return;
    } else if (thickness > min)
    {
        showError('Thickness must be less than ' + min);
        $('#opt1-thickness').addClass('border-error');
        return;
    } else if (thickness <= 0)
    {
        showError('Thickness must be greater than 0');
        $('#opt1-thickness').addClass('border-error');
        return;
    }
    var width = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt1-width').val()) : parseInt($('#opt1-width').val());
    if (isNaN(width))
    {
        showError('Please Enter valid Width value.');
        $('#opt1-width').addClass('border-error');
        return;
    } else if (width > max)
    {
        showError('Width must be less than ' + max);
        $('#opt1-width').addClass('border-error');
        return;
    } else if (width <= 0)
    {
        showError('Width must be greater than 0');
        $('#opt1-width').addClass('border-error');
        return;
    }
    var length = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt1-length').val()) : parseInt($('#opt1-length').val());
    if (isNaN(length))
    {
        showError('Please Enter valid Length value.');
        $('#opt1-length').addClass('border-error');
        return;
    } else if (length > max)
    {
        showError('Length must be less than ' + max);
        $('#opt1-length').addClass('border-error');
        return;
    } else if (length <= 0)
    {
        showError('Length must be greater than 0');
        $('#opt1-length').addClass('border-error');
        return;
    }
    calculateResult(1, thickness, width, length);
}
function CheckOpt2Ring(min, max)
{
    $('#opt2-thickness, #opt2-ID, #opt2-OD').removeClass('border-error');
    var thickness = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt2-thickness').val()) : parseInt($('#opt2-thickness').val());
    if (isNaN(thickness))
    {
        showError('Please Enter valid Thickness value.');
        $('#opt2-thickness').addClass('border-error');
        return;
    } else if (thickness > min)
    {
        showError('Thickness must be less than ' + min);
        $('#opt2-thickness').addClass('border-error');
        return;
    } else if (thickness <= 0)
    {
        showError('Thickness must be greater than 0');
        $('#opt2-thickness').addClass('border-error');
        return;
    }
    var ID = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt2-ID').val()) : parseInt($('#opt2-ID').val());
    if (isNaN(ID))
    {
        showError('Please Enter valid ID value.');
        $('#opt2-ID').addClass('border-error');
        return;
    } else if (ID > max)
    {
        showError('ID must be less than ' + max);
        $('#opt2-ID').addClass('border-error');
        return;
    } else if (ID <= 0)
    {
        showError('ID must be greater than 0');
        $('#opt2-ID').addClass('border-error');
        return;
    }
    var OD = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt2-OD').val()) : parseInt($('#opt2-OD').val());
    if (isNaN(OD))
    {
        showError('Please Enter valid OD value.');
        $('#opt2-OD').addClass('border-error');
        return;
    } else if (OD > max)
    {
        showError('OD must be less than ' + max);
        $('#opt2-OD').addClass('border-error');
        return;
    } else if (OD <= 0)
    {
        showError('OD must be greater than 0');
        $('#opt2-OD').addClass('border-error');
        return;
    }
    if (ID >= OD)
    {
        showError('ID must be greater than OD');
        $('#opt2-OD').val('').addClass('border-error');
        return;
    }
    calculateResult(2, thickness, ID, OD);
}
function checkOpt3Cylinder(min, max)
{
    $('#opt3-thickness, #opt3-diameter').removeClass('border-error');
    var thickness = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt3-thickness').val()) : parseInt($('#opt3-thickness').val());
    if (isNaN(thickness))
    {
        showError('Please Enter valid Thickness value.');
        $('#opt3-thickness').addClass('border-error');
        return;
    } else if (thickness > min)
    {
        showError('Thickness must be less than ' + min);
        $('#opt3-thickness').addClass('border-error');
        return;
    } else if (thickness <= 0)
    {
        showError('Thickness must be greater than 0');
        $('#opt3-thickness').addClass('border-error');
        return;
    }
    var diameter = $('input[name="rdoUnit-tab2"]:checked').val() === 'inch' ? parseFloat($('#opt3-diameter').val()) : parseInt($('#opt3-diameter').val());
    if (isNaN(diameter))
    {
        showError('Please Enter valid Diameter value.');
        $('#opt3-diameter').addClass('border-error');
        return;
    } else if (diameter > max)
    {
        showError('Diameter must be less than ' + max);
        $('#opt3-diameter').addClass('border-error');
        return;
    } else if (diameter <= 0)
    {
        showError('Diameter must be greater than 0');
        $('#opt3-diameter').addClass('border-error');
        return;
    }
    calculateResult(3, thickness, diameter, 0);
}
function showError(msg)
{
    $('.error-msg-tab2').text(msg);
    $('#lblResult-Pc-tab2, #lblResult-N-tab2').text('');
}

$(document).on('keypress', '.tab2-input', function (evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if ($('input[name="rdoUnit-tab2"]:checked').val() == 'inch')
    {
        if (
                (charCode != 45 || $(this).val().indexOf('-') != -1) && // â€œ-â€ CHECK MINUS, AND ONLY ONE.
                (charCode != 46 || $(this).val().indexOf('.') != -1) && // â€œ.â€ CHECK DOT, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
            return false;

        return true;
    } else if ($('input[name="rdoUnit-tab2"]:checked').val() == 'mm')
    {
        if (
                (charCode != 45 || $(this).val().indexOf('-') != -1) && // â€œ-â€ CHECK MINUS, AND ONLY ONE.
                (charCode < 48 || charCode > 57))
            return false;

        return true;
    }

});
function calculateResult(resFor, thickness, widthIdDiameter, lengthOD)
{
    var PC = 0.0;
    var N = 0.0
    if (resFor == 1)
    {
        PC = ((1.77 * thickness) / (widthIdDiameter * lengthOD)) * (Math.sqrt(((thickness * (widthIdDiameter + lengthOD)) + (widthIdDiameter * lengthOD))));
    } else if (resFor == 2)
    {
        PC = (((4 * thickness) / ((lengthOD * lengthOD) - (widthIdDiameter * widthIdDiameter))) * (Math.sqrt(((thickness * (lengthOD + widthIdDiameter)) / 2) + (((lengthOD * lengthOD) + (widthIdDiameter * widthIdDiameter)) / 4))));
    } else if (resFor == 3)
    {
        var radious = widthIdDiameter / 2;
        PC = (thickness / (radious * radious)) * (Math.sqrt(radious * (radious + thickness)));
    }
    N = (1 / (1 + PC));
    $('#lblResult-Pc-tab2').text(PC.toFixed(5));
    $('#lblResult-N-tab2').text(N.toFixed(5));
}

//Menu Start
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
//Menu End
