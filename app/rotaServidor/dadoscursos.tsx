
export default function DadosCursos() {
  const cursos = [ 
     { id: '1', titulo: 'Inglês Básico',
        cargaHoraria: '70 horas',
        salario: 'A negociar',
        idade: '14 a 22 anos',
        escolaridade:'Cursando ou concluído o ensino médio',
        requisitos:'Conhecimentos básicos de informática; Boa comunicação; Responsabilidade e vontade de aprender',
        beneficios:'Vale transporte; Vale alimentação; Seguro de vida;',
        topicos:[
          {descricao: '- Reconhecer as letras do alfabeto em inglês e soletrar seu nome e palavras simples em voz alta.'},
          {descricao: '- Usar os pronomes pessoais para dizer quem fala e sobre quem se fala em cada frase.'},
          {descricao: '- Montar frases com o verbo to be para se apresentar, dizer sua idade e falar de onde você é.'},
          {descricao: '- Falar de rotina, hábito e fato do dia a dia usando o presente simples.'},
        ] },
    { id: '2', titulo: 'Curso de Atendimento ao Cliente', descricao: 'Aprenda a oferecer um excelente atendimento aos clientes.' },
    { id: '3', titulo: 'Curso de Segurança no Trabalho', descricao: 'Conheça as principais medidas de segurança no ambiente de trabalho.' },
    { id: '4', titulo: 'Curso de Informática Básica', descricao: 'Domine os conceitos básicos de informática e softwares.' }
  ];
  return cursos;
}