# To-do and Notebook app

This is still a learning project, I have plans to keep working on this app and see where can I get. It is open source, licensed under the MIT License.

Even though is already open source, I want to learn other things like CI/CD and how to manage a project before looking for contributors.

## WARNING

This is just a UI demo, it still lacks a lot of basic features to be considered a useful app.

I started this project as a learning project with different technologies, so I have made a lot of mistakes that I intend to fix in the next days.

The current stage is Pre-alpha. I will be focused on UI optimazation, code improvements, and re-write of some parts of the code, see [roadmap](https://github.com/galearez/plan/projects/1 'roadmap') for info.

## Goals

- Easy to use: you don't have to download anything just go to the site and start using it

- Secure: [TO DO: I want to implement some kind of encryption]

- All in one place: [TO DO: I will try to implement some kind of sync, I want to implement browser storage and some kind of way to upload and download your data, I still don't know if this is possible]

## Main features

### To-do list

This feature was built from scratch, my goal was to make it simple to use. I tried to implement it in a way that the user can group their tasks together, depending on their context, and also, be capable of group their tasks in different lists.

Main interfaces:

- Task group: is a equivalent to a folder where a user can group their task lists
- Task list: is an interface containing related tasks
- To-do Element: is an interface representing a single element inside the task lists

By default each 'Task Group' has two task lists:

- 'Next 7 days', where the user can add the tasks for each day of the week
- 'Day tasks history', where the user can see the history of all the tasks they have added to 'Next 7 days'

### Notebook

This feature is a basic notebook, it was built using [Slate](https://docs.slatejs.org/ 'slate'). My goal with this feature was to create a basic text editor to help with note-taking, it's not intended to be a full featured text editor like Office Word or Google Docs.

This text editor uses the markdown format.

Main interfaces:

- Notebook: is an equivalent to a folder where an user can group their notes
- Note: is an interface containing related the content of the note

### [Roadmap](https://github.com/galearez/plan/projects/1 'Roadmap')

## Dependencies

- [React](https://reactjs.org/ 'react'): a JavaScript library for building user interfaces
- [Slate](https://docs.slatejs.org/ 'slate'): a completely customizable framework for building rich text editors.
- [Tailwind/CSS](https://tailwindcss.com/ 'tailwind'): a utility-first CSS framework for rapidly build modern websites

## License

MIT License ([LICENSE](https://github.com/galearez/plan/LICENSE-MIT 'license') or http://opensource.org/licenses/MIT)
