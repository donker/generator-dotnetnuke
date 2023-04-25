# Yeoman generator for various DNN extensions

[Yeoman](https://yeoman.io/) is a "scaffolding tool" for just about anything. There are generators to help you scaffold out all kinds of applications.
This generator will scaffold out [DNN Platform](https://github.com/dnnsoftware/Dnn.Platform) extensions. The project can consist of one or more components.
So it allows you to create complex solutions that can be rolled up into one installation zip file for DNN.

## Extension types

The following extension types can be created with this tool:

- MVC module
- PersonaBar module
- Skin
- Container
- Library

To support these extensions you can add these front-end components:

- React (Typescript)
- Scss (Sass)

## Getting started

You'll need to install Yeoman first. Run the following in a terminal:

``` bs
$ npm i -g yo
```

This will install Yeoman globally so you can run it in any directory. Now install the generator:

``` bs
$ npm i -g generator-dotnetnuke
```

Now you can begin to use the templates. Create an empty project folder and run

``` bs
$ yo dotnetnuke
```

and let the magic begin. You'll be prompted to select a project type first. **When running the generator for the first time in
a new project directory run the "Master Project" first!** This sets up the basics for the project like name, company name and
which version of DNN you'd like to target. It will create a solution file to which other projects will be added.

## Philosophy

### Develop outside the DNN installation

Note that this generator will create a solution that is not meant to be created inside your DNN development installation. 
Instead a file watcher will copy over relevant files when they change. This allows you to keep all your project's files in
one place and not have them scattered and intermingled with DNN's own files.

### Anticipate compound solutions

The generator will create a solution that can package any number of extensions into a single zip file that can be uploaded
into DNN. The zip file has a single manifest that contains all the relevant information about the extensions. You can package
multiple modules, skins, etc into a single release with a single release version.

### Manifests should be created on the fly

DNN manifests can be hard to craft and maintain. Over the years tons of features have been added and everything needs to be
spelled out in the manifest or your work will not install correctly. The templates used in this tool include a build system 
that does this (see below). The manifests are based on dnn.json files in the solution (which loosely follow DNN's XML manifests)
and the package.json which holds the global information for all projects like project owner and version. Note that the individual
dnn.json files can override these values.

### Automation for ease of maintenance

You should be able to release a new version of your solution with the least amount of work. This means you'll rely on
automation. With the created solution all you need to do is to change the version number of your solution in the package.json
and during the build process all assemblies will be updated with this new version number. Once tuned to your scenario
you can release in minutes.

## Build system

The generated solution uses [CakeBuild](https://cakebuild.net/) to create the installable zip file. This in turn relies on 
[Dnn.CakeUtils](https://github.com/DNNCommunity/Dnn.CakeUtils) to create the right manifest for your package. Run the following
in Powershell to kick off the build process:

``` ps
$ .\build.ps1
```

With this build system you can have assemblies automatically added to the manifest with their correct version numbers. Similarly
SQL scripts can be added automatically as well.

## File watching

To use the file watcher create a file called ```local.json``` in the root of your project. In it add this json:

``` json
{
  "dnn": {
    "pathsAndFiles": {
      "devSiteUrl": "http://mydevsiteurl",
      "devSitePath": "C:\\Path\\To\\Root\\Of\\DNNDevSite"
    }
  }
}
```

Now in a shell run the following command to begin file watching:

``` bs
$ npm run watch-server
```

