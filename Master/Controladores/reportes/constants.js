module.exports = {
    estatus_stp: 'Ejecutada',
    medio: 'Transferencia',
    fechaOperacion: { $gte: fechaInicial },
    fechaOperacion: { $lte: fechaFinal },
};