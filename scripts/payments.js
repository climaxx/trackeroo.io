function PayEmployee(idEmployee) {       
    var id = idEmployee.toString();

    var data = {
        bonus: false, 
        amount: 0.00
    };

    $.ajax({
        url: "/employees/edit/" + id,
        type: "PUT",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(data){
            console.log(data);
        },
        error: function(xhr, status, error){
            console.log(error.message);   
        }
    });
};