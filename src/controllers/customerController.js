const controller = {};

controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM Empleados', (err, empleados) => {
      if (err) {
        res.json(err);
      }
      res.render('empleados', {
        data: empleados,
      });
    });
  });
};

controller.listHistorial = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM Historial', (err, empleados) => {
      if (err) {
        res.json(err);
      }
      res.render('historial', {
        data: empleados,
      });
    });
  });
};

controller.listActivos = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM Empleados WHERE activo = 1', (err, empleados) => {
      if (err) {
        res.json(err);
      }
      res.render('activos', {
        data: empleados,
      });
    });
  });
};

controller.listDesconectados = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM Empleados WHERE activo = 0', (err, empleados) => {
      if (err) {
        res.json(err);
      }
      res.render('activos', {
        data: empleados,
      });
    });
  });
};

controller.save = (req, res) => {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query('INSERT INTO Empleados set ?', [data], (err, empleado) => {
      const dataHistorial = {
        id: empleado.insertId,
        nombre: data.nombre + ' ' + data.apellido,
        accion: 'CREADO',
        fecha: new Date(),
      };

      conn.query(
        'INSERT INTO Historial set ?',
        [dataHistorial],
        (err, historial) => {
          res.redirect('/');
        }
      );
    });
  });
};

controller.delete = (req, res) => {
  const id = req.params.id;
  req.getConnection((err, conn) => {
    conn.query(
      'SELECT * FROM Empleados WHERE id = ?',
      [id],
      (err, empleado) => {
        const dataHistorial = {
          id: id,
          nombre: empleado[0].nombre + ' ' + empleado[0].apellido,
          accion: 'ELIMINADO',
          fecha: new Date(),
        };

        conn.query(
          'INSERT INTO Historial set ?',
          [dataHistorial],
          (err, historial) => {}
        );
      }
    );
  });

  req.getConnection((err, conn) => {
    conn.query('DELETE FROM Empleados WHERE id = ?', [id], (err, del) => {
      res.redirect('/');
    });
  });
};

controller.update = (req, res) => {
  const rfid = req.params.rfid;
  req.getConnection((err, conn) => {
    conn.query(
      'SELECT * FROM Empleados WHERE rfid = ?',
      [rfid],
      (err, empleado) => {
        if (empleado) {
          const dataHistorial = {
            id: empleado[0].id,
            nombre: empleado[0].nombre + ' ' + empleado[0].apellido,
            accion: empleado[0].activo ? 'DESCONECTADO' : 'CONECTADO',
            fecha: new Date(),
          };

          conn.query(
            'INSERT INTO Historial set ?',
            [dataHistorial],
            (err, historial) => {}
          );
        }
      }
    );
  });

  req.getConnection((err, conn) => {
    conn.query(
      'SELECT * FROM Empleados WHERE rfid = ?',
      [rfid],
      (err, empleado) => {
        const dataHistorial = {
          id: empleado[0].id,
          nombre: empleado[0].nombre + ' ' + empleado[0].apellido,
          accion: empleado[0].activo ? 'DESCONECTADO' : 'CONECTADO',
          fecha: new Date(),
        };

        console.log({ empleado, rfid });
        console.log(!empleado[0].activo);

        conn.query(
          'UPDATE  Empleados set activo = ? WHERE rfid = ?',
          [!empleado[0].activo, rfid],
          (err, historial) => {
            return res.send('Ok');
          }
        );
      }
    );
  });
};

module.exports = controller;
