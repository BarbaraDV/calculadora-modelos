let results = {}

function showOptions(o) {
    //console.log(o.value)
    if (o.value > 1) {

        document.getElementById("limit").style.display = "block";
        document.getElementById("Calvalues2").style.display = "";
        document.getElementById("Calvalues2").classList = "bg-2 row p4";
        document.getElementById("Calvalues1").style.display = "none";

    }
    else {
        document.getElementById("limit").style.display = "none";
        document.getElementById("Calvalues1").style.display = "";
        document.getElementById("Calvalues1").className = "bg-2 row p4";
        document.getElementById("Calvalues2").style.display = "none";
    }
}

function printPageArea() {
    var printContent = document.getElementById('Results').innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}


function GetValues() {
    let form = {}
    form["tasa_llegada"] = 0
    form["tiempo_servicio"] = 0
    form["limite_cola"] = 0

    form["tasa_llegada"] = document.querySelector("#tasaLlegada").value
    form["tiempo_servicio"] = document.querySelector("#tiempoServicio").value
    form["limite_cola"] = document.querySelector("#limit").value
    form['opt'] = document.querySelector("#opt").value

    //Empty Form
    document.querySelector("#tasaLlegada").value = ''
    document.querySelector("#tiempoServicio").value = ''
    document.querySelector("#limit").value = ''

    return form
}

function SinLimite(form) {

    results["rho"] = form.tasa_llegada / form.tiempo_servicio
    results["Po"] = 1 - results.rho

    let stop = false
    let Pn = 0
    let n = 0
    var arregloPn = []
    let sum = 0


    while (!stop) {
        Pn = (1 - results.rho) * (results.rho ** n)
        //console.log("hola " + n)
        //console.log(Pn)
        //console.log(Number(Pn).toFixed(4))
        arregloPn[n] = []
        arregloPn[n]["n"] = n
        arregloPn[n]["Pn"] = Number(Pn)

        sum += Number(Pn)
        arregloPn[n]["Sum-Pn"] = sum

        //console.log(sum)


        n++
        if (Number(Pn).toFixed(4) == 0.0000) {
            stop = true; break;
        }
        Pn = 0
    }


    results["Pn"] = arregloPn
    results["Ls"] = results.rho / results.Po
    results["Lq"] = results.Ls - (form.tasa_llegada / form.tiempo_servicio)
    results["Ws"] = results.Ls / form.tasa_llegada
    results["Wq"] = results.Lq / form.tasa_llegada
}


function ConLimite(form) {
    results["rho"] = form.tasa_llegada / form.tiempo_servicio
    form.limite_cola = Number(form.limite_cola)

    if (results.rho == 1) {

        results["Po"] = (1 / (form.limite_cola + 1))
    }
    else {

        results["Po"] = ((1 - results.rho) / (1 - (results.rho ** (form.limite_cola + 1))))
    }

    //console.log(results.Po)
    //console.log("pn")

    let stop = false
    let Pn = 0
    let n = 0
    let values = []
    let sum = 0

    while (!stop) {

        Pn = ((results.rho ** n) * results.Po)

        values[n] = []
        values[n]["n"] = n
        values[n]["Pn"] = Number(Pn)
        sum += Number(Pn)
        values[n]["Sum-Pn"] = sum

        //console.log("hola " + n + "\n" + Number(Pn).toFixed(4))
        //console.log("sum " + Number(sum).toFixed(4))
        //console.log(sum)

        n++
        if (n > form.limite_cola) {
            stop = true; break;
        }
        Pn = 0
    }

    results["Pn"] = values
    results["lambdaEfec"] = form.tasa_llegada * (1 - results.Pn[form.limite_cola].Pn)
    results["lambdaPerd"] = form.tasa_llegada - results.lambdaEfec


    if (results.rho !== 1)
        results["Ls"] = (results.rho * (1 - ((form.limite_cola + 1) * (results.rho ** form.limite_cola)) + (form.limite_cola * (results.rho ** (form.limite_cola + 1))))) / ((1 - results.rho) * (1 - (results.rho ** (form.limite_cola + 1))))
    else
        results["Ls"] = (form.limite_cola / 2)

    results.rho = Number(results.rho)

    results["Lq"] = results.Ls - (results.lambdaEfec / form.tiempo_servicio)
    results["Wq"] = (results.Lq) / (results.lambdaEfec)
    results["Ws"] = (results.Wq) + (1 / form.tiempo_servicio)
}


function ShowValues(form) {


    //ocument.querySelector('table').setAttribute('data-empty', 'false');


    document.getElementById("Lambda1").innerHTML = form.tasa_llegada;
    document.getElementById("Mu1").innerHTML = form.tiempo_servicio;
    document.getElementById("Lambda2").innerHTML = form.tasa_llegada;
    document.getElementById("Mu2").innerHTML = form.tiempo_servicio;
    document.getElementById("limiteCola").innerHTML = form.limite_cola;



    let tableHead = document.createElement('tr')

    let nombres_columnas = Object.keys(results).map(e => e = "<th>" + e + "</th>")
    tableHead.innerHTML = "<tr>" + nombres_columnas + "</tr>"


    let tableRow = document.createElement('tr')

    let vcolumnas = []
    Object.keys(results).forEach(e => {
        //console.log(e)
        //console.log(results[e])
        if (e.toString() != "Pn")
            vcolumnas.push("<td>" + Number(results[e]).toFixed(4) + "</td>")
        else
            vcolumnas.push("<td class='p4'>" + (results[e].length - 1) + "</td>")
    })

    let tableData = vcolumnas

    //console.log(tableData)
    tableRow.innerHTML = "<tr>" + tableData + "</tr>"





    //#region   Tabla Estadistica  
    let tH = document.createElement('tr')
    tH.id = "head"
    document.querySelector('#tabelas').append(tH);
    Object.keys(results).forEach(x => {
        tH = document.createElement('th')
        tH.innerHTML = "<th class='p2'>" + x + "</th>"
        document.querySelector('#head').append(tH);
    })


    tH = document.createElement('tr')
    tH.id = "data"
    document.querySelector('#tabelas').append(tH);
    vcolumnas.forEach(x => {
        tH = document.createElement('td')
        tH.innerHTML = x
        document.querySelector('#data').append(tH);
    })

    //#endregion





    //#region   Pn  

    vcolumnas = []
    results.Pn.forEach(e => {
        //console.log(e)
        //console.log(results[e])
        Object.keys(results.Pn[0]).forEach(x => {
            vcolumnas.push("<td>" + Number(e[x]).toFixed(4) + "</td>")
        })
    })


    tH = document.createElement('tr')
    tH.id = "head1"
    document.querySelector('#tabelas2').append(tH);
    Object.keys(results.Pn[0]).forEach(x => {
        tH = document.createElement('th')
        tH.innerHTML = "<th class='p2'>" + x + "</th>"
        document.querySelector('#head1').append(tH);
    })


    let k = ""
    let i = 0
    vcolumnas = []


    if (results.Pn.length > 0) {
        document.getElementById("Values2").style.display = "block";
    }


    results.Pn.forEach(e => {
        //console.log(e)
        //console.log(results[e])

        tH = document.createElement('tr')
        tH.id = "data" + i
        k = "#" + tH.id
        console.log(k)
        document.querySelector('#tabelas2').append(tH);

        Object.keys(results.Pn[0]).forEach(x => {

            tH = document.createElement('td')
            tH.innerHTML = ("<td>" + Number(e[x]).toFixed(4) + "</td>")
            document.querySelector(k).append(tH);
            //vcolumnas.push("<td>"+Number(e[x]).toFixed(4)+"</td>")
        })
        i++

    })

}





function EjecuteCalc() {



    try {


        let crearTablaNueva = document.getElementById('tabelas')



        while (crearTablaNueva.firstChild) {
            crearTablaNueva.removeChild(crearTablaNueva.firstChild);
        }



        crearTablaNueva = document.getElementById('tabelas2')
        while (crearTablaNueva.firstChild) {
            crearTablaNueva.removeChild(crearTablaNueva.firstChild);
        }

        var xx = GetValues()

        console.log(xx.opt)

        if (Number(xx.opt) > 1) {
            ConLimite(xx)
        }
        else {

            if (Number(xx.tasa_llegada) >= Number(xx.tiempo_servicio) || Number(form.tiempo_servicio) == 0  || form.tasa_llegada == '' || form.tiempo_servicio == ''){
                alert("No es posible efectuar la operación con los datos ingresados. Por tanto, ocurrió un:");
            } else {
                SinLimite(xx)
            }
        }
        ShowValues(xx)
        results = {} //Limpiar el JSON para que no se sobrescriban los valores
    }

    catch (e) {
        alert("Error en el cálculo solicitado")
    }

}