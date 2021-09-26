import fs from 'fs';
import path from 'path';

import {requireTechnologies} from "@ohoareau/technologies";
export const detectTechnologies = (rawDir: string): string[] => {
    const dir = path.resolve(rawDir);
    const technos = {};
    const packageJson = `${dir}/package.json`;
    const makefile = `${dir}/Makefile`;
    const gitignore = `${dir}/.gitignore`;
    const nvmrc = `${dir}/.nvmrc`;
    const yarnrc = `${dir}/.yarnrc`;
    const yarnLock = `${dir}/yarn.lock`;
    const terraformversion = `${dir}/.terraform-version`;
    const lernaJson = `${dir}/lerna.json`;
    const goMod = `${dir}/go.mod`;
    const tsconfigJson = `${dir}/tsconfig.json`;
    const github = `${dir}/.github`;
    const dockerignore = `${dir}/.dockerignore`;
    fs.existsSync(packageJson) && Object.assign(technos, detectTechnologiesFromPackageJsonObject(require(packageJson)));
    fs.existsSync(tsconfigJson) && Object.assign(technos, detectTechnologiesFromTsconfigJsonObject(require(tsconfigJson)));
    fs.existsSync(makefile) && Object.assign(technos, detectTechnologiesFromMakefileContent(fs.readFileSync(makefile, 'utf8')));
    fs.existsSync(gitignore) && Object.assign(technos, detectTechnologiesFromGitIgnoreContent(fs.readFileSync(gitignore, 'utf8')));
    fs.existsSync(dockerignore) && Object.assign(technos, detectTechnologiesFromDockerIgnoreContent(fs.readFileSync(dockerignore, 'utf8')));
    fs.existsSync(nvmrc) && Object.assign(technos, detectTechnologiesFromNvmRcContent(fs.readFileSync(nvmrc, 'utf8')));
    fs.existsSync(yarnrc) && Object.assign(technos, detectTechnologiesFromYarnRcContent(fs.readFileSync(yarnrc, 'utf8')));
    fs.existsSync(terraformversion) && Object.assign(technos, detectTechnologiesFromTerraformVersionContent(fs.readFileSync(terraformversion, 'utf8')));
    fs.existsSync(yarnLock) && Object.assign(technos, detectTechnologiesFromYarnLockContent(fs.readFileSync(yarnLock, 'utf8')));
    fs.existsSync(lernaJson) && Object.assign(technos, detectTechnologiesFromLernaJsonObject(require(lernaJson)));
    fs.existsSync(github) && Object.assign(technos, detectTechnologiesFromGithubDirectory(github));
    fs.existsSync(goMod) && Object.assign(technos, detectTechnologiesFromGoModContent(fs.readFileSync(goMod, 'utf8')));
    const rawIds = Object.entries(technos).reduce((acc, [k, v]) => {
        !!v && acc.push(k);
        return acc;
    }, <string[]>[]);
    return requireTechnologies(rawIds).fullDependencies;
};

export const detectTechnologiesFromPackageJsonObject = (o: any): any => {
    const technos = {npm: true};
    o.dependencies && Object.assign(technos, detectTechnologiesFromPackageJsonDependenciesObject(o.dependencies));
    o.peerDependencies && Object.assign(technos, detectTechnologiesFromPackageJsonDependenciesObject(o.peerDependencies));
    o.devDependencies && Object.assign(technos, detectTechnologiesFromPackageJsonDependenciesObject(o.devDependencies));
    return technos;
};

export const detectTechnologiesFromGoModContent = (c: string): any => {
    return {
        go: true,
    };
};

export const detectTechnologiesFromTsconfigJsonObject = (o: any): any => {
    return {
        typescript: true,
    };
};

export const detectTechnologiesFromLernaJsonObject = (o: any): any => {
    return {
        lerna: true,
    };
};

export const detectTechnologiesFromMakefileContent = (c: string): any => {
    return {
        make: true,
    };
};

export const detectTechnologiesFromGitIgnoreContent = (c: string): any => {
    return {
        git: true,
    };
};

export const detectTechnologiesFromDockerIgnoreContent = (c: string): any => {
    return {
        docker: true,
    };
};

export const detectTechnologiesFromNvmRcContent = (c: string): any => {
    return {
        nvm: true,
    };
};

export const detectTechnologiesFromYarnRcContent = (c: string): any => {
    return {
        yarn: true,
    };
};

export const detectTechnologiesFromTerraformVersionContent = (c: string): any => {
    return {
        terraform: true,
    };
};

export const detectTechnologiesFromYarnLockContent = (c: string): any => {
    return {
        yarn: true,
    };
};

export const detectTechnologiesFromGithubDirectory = (dir: string): any => {
    return {
        github: true,
        github_actions: fs.existsSync(`${dir}/workflows`),
    };
};

export const detectTechnologiesFromPackageJsonDependenciesObject = (o: any): any => {
    const add = addTechno;
    return Object.entries(o || {}).reduce((t, [k]) => {
        switch (true) {
            case 'aws-sdk' === k: add(t, ['aws_sdk']); break;
            case 'passport' === k: add(t, ['passportjs']); break;
            case 'express' === k: add(t, ['express']); break;
            case 'apollo-server-lambda' === k: add(t, ['apollo_server']); break;
            case 'apollo-server' === k: add(t, ['apollo_server']); break;
            case /^@babel\//.test(k): add(t, ['babel']); break;
            case /^@storybook\//.test(k): add(t, ['storybook']); break;
            case /prismic/.test(k): add(t, ['prismicio_sdk']); break;
            case 'dynamoose' === k: add(t, ['dynamoose', 'aws_dynamodb']); break;
            case /graphql/.test(k): add(t, ['graphql']); break;
            case /gatsby/.test(k): add(t, ['react_gatsby']); break;
            case 'jsonwebtoken' === k: add(t, ['jwt']); break;
            case 'ejs' === k: add(t, ['ejs']); break;
            case 'jest' === k: add(t, ['jest']); break;
            case 'react' === k: add(t, ['react_js']); break;
            case 'prettier' === k: add(t, ['prettier']); break;
            case 'react-scripts' === k: add(t, ['react_cra']); break;
            case 'typescript' === k: add(t, ['typescript']); break;
            case '@material-ui/core' === k: add(t, ['react_materialui']); break;
            case '@ohoareau/microgen' === k: add(t, ['microgen']); break;
            case '@genjs/genjs' === k: add(t, ['genjs']); break;
            case '@ohoareau/microlib' === k: add(t, ['microlib']); break;
            case 'nodemon' === k: add(t, ['nodemon']); break;
            case 'lerna' === k: add(t, ['lerna']); break;
        }
        return t;
    }, <any>{});
};

export const addTechno = (o: any, t: string|string[]) => (Array.isArray(t) ? t : [t]).reduce((acc, x) => Object.assign(acc, {[x]: true}), o);