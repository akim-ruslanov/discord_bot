const path = require('node:path');
const fs = require('node:fs');
const { parse } = require("csv-parse");
const { SlashCommandBuilder } = require('discord.js');

const libsPath = path.join(path.dirname(require.main.filename), 'resources');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-picker')
		.setDescription('Information about the options provided.')
		.addStringOption(option => option.setName('lib').setDescription('Which library to use')),
	async execute(interaction) {
		let lib = interaction.options.getString('input');
        if (!lib) lib = "nba_teams";

        const libsPath = path.join(path.dirname(require.main.filename), 'resources');
        const libs = fs.readdirSync(libsPath).filter(file => file.endsWith('.csv'));
        let libPath;
        if (libs.includes(lib+".csv")) {
            libPath = path.join(libsPath, lib+".csv");
        } else {
            return interaction.reply('Library does not exist');
        }

        let data = [];
        fs.createReadStream(libPath)
            .pipe(parse({delimiter: ',', from_line: 2}))
            .on('data', function(csvrow) {
                data.push(csvrow);
            })
            .on('end',function() {
                const randomIndex = Math.floor(Math.random() * data.length);
                return interaction.reply(`The options value is: \`${data[randomIndex]}\``)
            });
	},
};