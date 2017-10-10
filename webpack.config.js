var config = {
    entry: "./main.js",

    output: {
        path: "/",
        filename: "index.js"
    },

    resolve: {
        modules: [
            "node_modules",
            process.cwd()
        ]
    },

    devServer: {
        host: "localhost",
        inline: true,
        port: 8090
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",

                query: {
                    presets: ["es2015", "react"]
                }
            }
        ]
    }
};

module.exports = config;