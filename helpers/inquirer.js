import inquirer from 'inquirer';
import colors from 'colors';

const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [ // choices: ['1. Crear tarea', 'opt2', 'opt3']
        {
            value: 1,
            name: `${'1.'.green} Buscar ciudad`
        },
        {
            value: 2,
            name: `${'2.'.green} Historial`
        },
        {
            value: 0,
            name: `${'0.'.green} Salir`
        }
    ]

}];


const inquirerMenu = async() => {

    console.clear();
    console.log("========================".green);
    console.log("  Seleccione una opcion".white);
    console.log("========================\n".green);

    const { opcion } = await inquirer.prompt(preguntas); //devuelve un string -->  { opt: { opcion: '1. Crear tarea' } }

    return opcion;

}

const pausa = async() => {

    const questions = [{
        type: 'input',
        name: 'enter',
        message: `\nPresione ${ "ENTER".green } para continuar..`
    }];

    console.log('\n');

    await inquirer.prompt(questions);

}

const leerInput = async(message) => {

    const question = [

        {
            type: 'input',
            name: 'lugar',
            message,
            validate(value) {
                if (value.length === 0)
                    return 'Por favor ingrese un valor';

                return true;
            }
        }
    ]

    const { lugar } = await inquirer.prompt(question);

    return lugar;

}


const listarLugares = async(lugares = []) => {

    const choices = lugares.map((lugar, i) => { 

        const index = `${i + 1}.`.green;

        return {
            value: lugar.id, 
            name: `${ index } ${lugar.nombre}`
        }

    });

    choices.unshift( //unshift --> agrega un nuevo elemento al ppio a mi array
        {
            value: '0',
            name: `${'0.'.green} Cancelar`
        }
    )

    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar: ',
        choices
    }]

    const { id } = await inquirer.prompt(preguntas);

    return id;

}

const confirmarBorrar = async() => {

    const question = [{
        type: 'confirm', //confirm: boolean
        name: 'ok',
        message: '¿Esta seguro?'
    }]

    const { ok } = await inquirer.prompt(question);

    return ok;
}


const mostrarListadoChecklist = async(tareas = []) => {

    const choices = tareas.map((tarea, i) => {

        const index = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${ index } ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false // muestra como chequeado la tarea
        }

    });

    const preguntas = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Selecciones: ',
        choices
    }]

    const { ids } = await inquirer.prompt(preguntas);

    return ids;

}


export { inquirerMenu, pausa, leerInput, listarLugares, confirmarBorrar, mostrarListadoChecklist };
