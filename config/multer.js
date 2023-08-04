const multer = require("multer");
const path = require("path");

const upload_chamado_professor = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/chamado_professor"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const alteracao_professor_imagem = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/chamado_professor"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const upload_chamado_aluno = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/chamado_aluno"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const alteracao_aluno_imagem = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/chamado_aluno"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const upload_admin = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/admin"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const upload_aluno = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/aluno"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const upload_professor = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/professor"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
  });

const upload_funcionario = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.resolve("./public/upload/funcionario"));
      },
      filename: (req, file, cb) => {
        cb(null, Date.now().toString() + "_" + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      var extensaoImg = path.extname(file.originalname).toLocaleLowerCase();

      if (
        extensaoImg == ".jpg" ||
        extensaoImg == ".png" ||
        extensaoImg == ".jpeg"
      ) {
        return cb(null, true);
      } else {
        cb("Apenas envio de arquivos de imagens", false);
      }
    },
});

module.exports = {
  upload_chamado_professor,
  alteracao_professor_imagem,
  alteracao_aluno_imagem,
  upload_chamado_aluno,
  upload_admin,
  upload_aluno,
  upload_professor,
  upload_funcionario,
};
