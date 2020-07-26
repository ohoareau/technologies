export const getFragment = (type: string, id: string) => ({
    type: 'template',
    template: `${__dirname}/../templates/${type}/${id.replace(/_/g, '/')}.md.ejs`,
});

export const recursiveGetTechnology = (id: string, context: any): any => {
    const t = require(`${__dirname}/../db/${id.replace(/_/g, '/')}.json`);
    t.id = id;
    t.name = t.name || t.id.replace(/_/g, ' ');
    t.path = id.replace(/_/g, '/');
    t.installProcedure && (t.installProcedure = {id, name: t.name, ...getFragment('install-procedures', id)});
    t.preRequisite && (t.preRequisite = {id, name: t.name, ...getFragment('pre-requisites', id)});
    t.dependencies = t.dependencies || [];
    t.fullDependencies = [...t.dependencies];
    t.installProcedures = t.installProcedure ? {
        [id]: t.installProcedure,
    } : {};
    t.preRequisites = t.preRequisite ? {
        [id]: t.preRequisite,
    } : {};
    t.requiredTechnologies = {};
    (t.dependencies).reduce((acc, d) => {
        const subT = context.fetched[d] || recursiveGetTechnology(d, context);
        acc.fullDependencies = acc.fullDependencies.concat(subT.fullDependencies);
        acc.installProcedures = {...acc.installProcedures, ...subT.installProcedures};
        acc.preRequisites = {...acc.preRequisites, ...subT.preRequisites};
        Object.assign(t.requiredTechnologies, subT.requiredTechnologies);
        t.requiredTechnologies[subT.id] = subT;
        return acc;
    }, t);
    t.orderedFullDependencies = computeDependenciesOrder(t.fullDependencies, t.requiredTechnologies);
    t.fullDependencies = [...new Set(t.fullDependencies)];
    t.fullDependencies.sort();
    context.fetched[id] = t;
    return t;
}
export const computeDependencyWeight = (id, reqs: any, ctx: any): number => {
    if (ctx[id]) return ctx[id].weight;
    if (!reqs[id]) return -1;
    const r = reqs[id];
    ctx[id] = {id, weight: (r.fullDependencies || []).reduce((acc, k) => acc + computeDependencyWeight(k, reqs, ctx), 1)};
    return ctx[id].weight;
}
export const computeDependenciesOrder = (deps: string[], reqs: any, ctx: any = {}): string[] => {
    deps.reduce((acc, d) => {
        acc[d] = {id: d, weight: computeDependencyWeight(d, reqs, acc)};
        return acc;
    }, ctx);
    const newDeps = Object.values(ctx) as any[];
    newDeps.sort((a, b) => a.weight > b.weight ? 1 : (a.weight < b.weight ? -1 : 0));
    return newDeps.map(d => d.id);
};

export const sortAndDedupArray = (a: any[]) => {
    const b = [...new Set(a)];
    b.sort();
    return b;
};
export const requireTechnologies = (rawIds: string[]): any => {
    const ids = rawIds.filter(x => !!x);
    const context = {fetched: {}};
    const x = ids.map(id => recursiveGetTechnology(id, context));
    const deps = sortAndDedupArray([
        ...ids,
        ...x.reduce((acc, y) => {acc = acc.concat((<any> y).fullDependencies || []); return acc;}, []),
    ]);
    const technologies = {
        ...x.reduce((acc, y) => Object.assign(acc, {[(<any> y).id]: y}), {}),
        ...x.reduce((acc, y) => Object.assign(acc, (<any> y).requiredTechnologies || {}), {}),
    };
    const ctxDeps = {};
    const fullDependencies = computeDependenciesOrder(deps, technologies, ctxDeps);
    let preRequisites = Object.values({
        ...x.reduce((acc, y) => Object.assign(acc, (<any> y).preRequisites || {}), {}),
    });
    let installProcedures = Object.values({
        ...x.reduce((acc, y) => Object.assign(acc, (<any> y).installProcedures || {}), {}),
    });
    const sorter = (a, b) => {
        const wa = ctxDeps[a.id] ? ctxDeps[a.id].weight : 100000;
        const wb = ctxDeps[b.id] ? ctxDeps[b.id].weight : 100000;
        return (wa > wb ? 1 : (wa < wb ? -1 : 0));
    };
    preRequisites.sort(sorter)
    installProcedures.sort(sorter);
    preRequisites = preRequisites.reduce((acc, item) => Object.assign(acc, {[(<any>item).id]: item}), {}) as any;
    installProcedures = installProcedures.reduce((acc, item) => Object.assign(acc, {[(<any>item).id]: item}), {}) as any;
    return {
        fullDependencies,
        technologies,
        preRequisites,
        installProcedures,
    }
}
export const getTechnology = (id: string): any => {
    return recursiveGetTechnology(id, {fetched: {}});
}
export default getTechnology