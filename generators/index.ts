import { exec } from 'child_process';

const isNotEmpty = (value: string) => {
  if (value.trim().length === 0) return 'Name is required';
  return true;
};

export default function (plop) {
  plop.setGenerator('modules', {
    description: 'Create a module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: `What is this module's name?`,
        validate: isNotEmpty,
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: `${process.cwd()}/src/modules/{{name}}`,
        templateFiles: './templates/*.hbs',
        skipIfExists: true,
      },
      { type: 'prettify' },
    ],
  });
  plop.setActionType('prettify', (answers: { name: string }) => {
    exec(
      `prettier --config .prettierrc ${process.cwd()}/src/modules/${
        answers.name
      } --write`
    );
  });
}
