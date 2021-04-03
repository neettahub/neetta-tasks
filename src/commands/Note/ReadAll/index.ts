import { Message, MessageEmbed } from "discord.js"
import { NoteRepository } from "../../../repositories/implementations/NoteRepository"
import moment from 'moment'
moment.locale('pt-br')

class NoteReadAllCommand {
  async execute(message: Message) {
    const noteRepository = NoteRepository.create(message.author)

    const notes = await noteRepository.readAll()

    if (notes.length === 0) {
      return message.channel.send('Você ainda não fez nenhuma anotação! Comece uma agora!')
    }

    const stringToCodeBlock = (str: string, code: 'diff' | 'js') => {
      return `\`\`\`${code}\n${str}\`\`\``
    }

    const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setDescription(stringToCodeBlock(
        notes
          .sort((noteA, noteB) => noteA.editedAt - noteB.editedAt)
          .map(note => `(${note.id}) - ${note.content.substring(0, 30) + '...'}`).join('\n'), 'diff'))
    .setFooter('Utilize !anotação (id) para ler todo o conteúdo!')

    message.channel.send(embed)
  }
}

const noteReadAllCommand = new NoteReadAllCommand()

export { noteReadAllCommand }