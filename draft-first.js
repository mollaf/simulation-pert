
const { O_NONBLOCK } = require('constants');
const fs = require('fs');
const { exit } = require('process');


const graph = 
[
    { code: 'A', description: 'Pazar araştırması',                      duration: () => 10, precedence: [] },
    { code: 'B', description: 'Dış gelişim odak grubu',                 duration: () => 14, precedence: [] },
    { code: 'C', description: 'Özellik seçimi',                         duration: () => 4,  precedence: ['A','B'] },
    { code: 'D', description: 'Yazılım mühendisliği',                   duration: () => 26, precedence: ['C'] },
    { code: 'E', description: 'İşletim sistemi geliştirme',             duration: () => 14, precedence: ['D','B'] },
    { code: 'F', description: 'Reklam kampanyası',                      duration: () => 20, precedence: ['D','M','N'] },
    { code: 'G', description: 'Tedarikçi seçimi ve anlaşma',            duration: () => 20, precedence: ['D'] },
    { code: 'H', description: 'Parça envanteri takviyesi',              duration: () => 45, precedence: ['G'] },
    { code: 'I', description: 'Montaj tesisi kurma',                    duration: () => 18, precedence: ['D'] },
    { code: 'J', description: 'Tamamlanmış ürün envanteri takviyesi',   duration: () => 7, precedence: ['I','H'] },
    { code: 'K', description: 'Kütüphane & Programlayıcı alet takımı geliştirme', duration: () => 13, precedence: ['E'] },
    { code: 'L', description: 'Dış gelişim destek kurulumu',            duration: () => 5,  precedence: ['K'] },
    { code: 'M', description: 'İç oyun geliştirme ',                    duration: () => 28, precedence: ['K'] },
    { code: 'N', description: 'Dış oyun geliştirme',                    duration: () => 34, precedence: ['L','O'] },
    { code: 'O', description: 'Platform tanıtımı',                      duration: () => 6,  precedence: ['K'] },
    { code: 'P', description: 'Yayın evi seçimi ve anlaşması',          duration: () => 5,  precedence: ['M'] },
    { code: 'Q', description: 'Web sitesi kurulumu',                    duration: () => 20, precedence: ['M'] },
    { code: 'R', description: 'Tanıtım metaryeli tasarımı',             duration: () => 3,  precedence: ['D','M','N'] },
    { code: 'S', description: 'Dağıtım kanallarının geliştirilmesi ve anlaşması', duration: () => 9, precedence: ['R'] },
    { code: 'T', description: 'Nakliye seçimi ve anlaşması',            duration: () => 4,  precedence: ['S'] },
    { code: 'U', description: 'Etkinlik organizasyonunun başlatılması', duration: () => 5, precedence: ['R'] },
    { code: 'V', description: 'Yazılım & Donanım sevkiyatı',            duration: () => 1,  precedence: ['J','T','P','N'] },
    { code: 'Z', description: 'Piyasaya sürme ',                        duration: () => 0,  precedence: ['V','U','Q','F'] },
]


// 41:39 
// 46:30
// 52:10


const make_uniform_random = (seed) => {

    const m = 251;
    const a = 11;
    const c = 0;
    const Z0 = seed;
    let Zi = Z0;
    let index = 0;
    const rangeIterator = {
        next: function() {
            Z_prev = Zi;
            Zi = (a * Zi + c) % m;
            index += 1;
            const Ui = parseFloat((Zi / m).toFixed(3)); 

            // const texZi = `Z_{${index}} = a \\cdot Z_{${index-1}} + c \\pmod{m} = ${a} \\cdot ${Zi} + ${c} \\pmod{${m}} = ${Zi}`; 
            // const texUi = `U_{${index}} = Z_{${index}}/m = ${Zi}/${m} = ${Ui}`;

            const texZi = `Z_{${index}} = ${a} \\cdot ${Z_prev} + ${c} \\pmod{${m}} = ${Zi}`; 
            const texUi = `U_{${index}} = ${Zi}/${m} = ${Ui}`;

            // console.log("___" + tex)
            return { value: Ui, textZi: texZi, textUi: texUi };
        }
    }

    return rangeIterator;
    
}

const generante_uniform_rv = (count, seed) => {
    const random_variable = make_uniform_random(seed);
    const random_numbers = [];
    for (var i = 0; i < count; i++) {
        const random_number = random_variable.next();
        random_numbers.push(random_number);
    }

    const tex = `$\\begin{array}{ll}\n${random_numbers.reduce((acc, a) => `${acc}${a.textZi} & ${a.textUi} \\\\ \n`, '')}\\end{array}$`

    return { value: random_numbers.map(a => a.value), text: tex }
}


const make_exp_rv = (lambda, uniform_rv) => {

    // const result = [];
    // for (var i = 0; i < uniform_rv.length; i++) {
    //     const x = uniform_rv[i];
    //     const val = -Math.log(1-x) / lambda;
    //     result.push(val)
    // }
    // return { value: result, }

    const tex = `$\\begin{array}{ll}\n${uniform_rv.reduce((acc, a,i) => `${acc}X_{${i+1}} = (-\\ln(1-U_{${i+1}}))/\\lambda = (-\\ln(1-${a}))/${lambda} = (-\\ln(${parseFloat((1-a).toFixed(3))}))/${lambda} = (${(parseFloat(-Math.log(1-a)).toFixed(3))})/${lambda} = ${parseFloat((-Math.log(1-a)/lambda).toFixed(3))} \\\\ \n`, '')}\\end{array}$`
    const result = uniform_rv.map(x => parseFloat( (-Math.log(1-x) / lambda).toFixed(3)));
    return { value: result, text: tex }
}


const make_normal_rv = (mu, sigma, uniform1_rv, uniform2_rv) => {

    const result = [];
    let text = `$\\begin{array}{ll}`;

    for (var i = 0; i < uniform1_rv.length; i++) {

        const x1 = uniform1_rv[i];
        const x2 = uniform2_rv[i];

        const y = parseFloat((mu + sigma * parseFloat(Math.sqrt(-2 * parseFloat(Math.log(x1).toFixed(3))).toFixed(3)) * parseFloat((Math.cos(2*Math.PI*x2)).toFixed(3))).toFixed(3))
        // text += `X_{${i+1}} = \mu + \sigma \sqrt{-2 \ln{U_{1}}} \cos{2\pi U_{2}}`
        text += `\nX_{${i+1}}`
        text += ` = ${mu} + ${sigma} \\sqrt{-2 \\ln({${x1}})}  \\cos({2\\pi \\cdot ${x2}})`
        text += ` = ${mu} + ${sigma} \\sqrt{-2 \\cdot (${parseFloat(Math.log(x1).toFixed(3))})} \\cdot \\cos(${parseFloat((2*Math.PI*x2).toFixed(3))})`
        text += ` = ${mu} + ${sigma} \\sqrt{${-2 * parseFloat(Math.log(x1).toFixed(3))}} \\cdot (${parseFloat((Math.cos(2*Math.PI*x2)).toFixed(3))})`
        text += ` = ${mu} + ${sigma} \\cdot (${parseFloat(Math.sqrt(-2 * parseFloat(Math.log(x1).toFixed(3))).toFixed(3))}) \\cdot (${parseFloat((Math.cos(2*Math.PI*x2)).toFixed(3))})`
        text += ` = ${y}`
        text += "\\\\"
        
        result.push(y)
    }

    text += "\n\\end{array}$";

    return { value: result, text: text }

}



const random_number_count = 10;

const rv1 = generante_uniform_rv(random_number_count, 5)
const rv2 = generante_uniform_rv(random_number_count, 15)
const rv3 = generante_uniform_rv(random_number_count, 25)
const rv4 = generante_uniform_rv(random_number_count, 35)
const rv5 = generante_uniform_rv(random_number_count, 20)
const rv6 = generante_uniform_rv(random_number_count, 30)

console.log('\n' + rv1.text)
console.log('\n' + rv2.text)
console.log('\n' + rv3.text)
console.log('\n' + rv4.text)
console.log('\n' + rv5.text)
console.log('\n' + rv6.text)

const total1 = rv1.value.reduce((acc,x) => acc + x, 0)
const total2 = rv2.value.reduce((acc,x) => acc + x, 0)
const total3 = rv3.value.reduce((acc,x) => acc + x, 0)
const total4 = rv4.value.reduce((acc,x) => acc + x, 0)
const total5 = rv5.value.reduce((acc,x) => acc + x, 0)
const total6 = rv6.value.reduce((acc,x) => acc + x, 0)

const avg1 = total1 / rv1.value.length;
const avg2 = total2 / rv1.value.length;
const avg3 = total3 / rv1.value.length;
const avg4 = total4 / rv1.value.length;
const avg5 = total4 / rv1.value.length;
const avg6 = total4 / rv1.value.length;

// console.log(rv1.value)

console.log(`rv1 - total: ${total1.toFixed(3)}, avg: ${avg1.toFixed(3)}`)
console.log(`rv2 - total: ${total2.toFixed(3)}, avg: ${avg2.toFixed(3)}`)
console.log(`rv3 - total: ${total3.toFixed(3)}, avg: ${avg3.toFixed(3)}`)
console.log(`rv4 - total: ${total4.toFixed(3)}, avg: ${avg4.toFixed(3)}`)
console.log(`rv5 - total: ${total5.toFixed(3)}, avg: ${avg5.toFixed(3)}`)
console.log(`rv6 - total: ${total6.toFixed(3)}, avg: ${avg6.toFixed(3)}`)


E1 = 14;
lambda1 = parseFloat((1/E1).toFixed(4))
const exp1 = make_exp_rv(lambda1, rv1.value)
console.log()
console.log(`$\\lambda_1 = ${lambda1}$`)
console.log(exp1.text)
// console.log(exp1.value)
// console.log(exp1.value.reduce((acc,x) => acc + x, 0)/exp1.value.length)

E2 = 28;
lambda2 = parseFloat((1/E2).toFixed(4))
const exp2 = make_exp_rv(lambda2, rv2.value)
console.log()
console.log(`$\\lambda_2 = ${lambda2}$`)
console.log(exp2.text)


let exp_array1 = `$\\begin{array}{c|c}\n\\text{Uniform} & \\text{Exponential(${E1})} \\\\ \\text{Random Number} & \\text{Random Number} \\\\ \\hline\n`
for (var i = 0; i < random_number_count; i++) {
    exp_array1 += `${rv1.value[i]} &  ${exp1.value[i]} \\\\ \n`
}
exp_array1 += "\\end{array}$"
console.log()
console.log(exp_array1)




let exp_array2 = `$\\begin{array}{c|c}\n\\text{Uniform} & \\text{Exponential(${E2})} \\\\ \\text{Random Number} & \\text{Random Number} \\\\ \\hline\n`
for (var i = 0; i < random_number_count; i++) {
    exp_array2 += `${rv2.value[i]} &  ${exp2.value[i]} \\\\ \n`
}
exp_array2 += "\\end{array}$"
console.log()
console.log(exp_array2)




normal_E1 = 13;
normal_sigma1 = 2;
const normal1 = make_normal_rv(normal_E1, normal_sigma1, rv3.value, rv4.value);
console.log()
console.log(normal1.text)

let exp_array3 = `$\\begin{array}{c|c|c}\n\\text{Uniform} & \\text{Uniform} & \\text{Normal(${normal_E1}, ${normal_sigma1})} \\\\ \\text{Random Number} & \\text{Random Number} & \\text{Random Number} \\\\ \\hline\n`
for (var i = 0; i < random_number_count; i++) {
    exp_array3 += `${rv3.value[i]}  & ${rv4.value[i]} &  ${normal1.value[i]} \\\\ \n`
}
exp_array3 += "\\end{array}$"
console.log()
console.log(exp_array3)




normal_E2 = 34;
normal_sigma2 = 5;
const normal2 = make_normal_rv(normal_E2, normal_sigma2, rv5.value, rv6.value);
console.log()
console.log(normal2.text)

let exp_array4 = `$\\begin{array}{c|c|c}\n\\text{Uniform} & \\text{Uniform} & \\text{Normal(${normal_E2}, ${normal_sigma2})} \\\\ \\text{Random Number} & \\text{Random Number} & \\text{Random Number} \\\\ \\hline\n`
for (var i = 0; i < random_number_count; i++) {
    exp_array4 += `${rv5.value[i]}  & ${rv6.value[i]} &  ${normal2.value[i]} \\\\ \n`
}
exp_array4 += "\\end{array}$"
console.log()
console.log(exp_array4)




// ----------------------------------------


// ```dot
// digraph structs {
//     rankdir=LR;
//     node [shape=record];
//     A [label=" { { A | 10} | { ES | LS} | { EF | LF  } }", style=filled, fillcolor=lightyellow];
//     B [label=" { { B | 14} | { ES | LS} | { EF | LF  } }"];
//     C [label=" { { B | 4 } | { ES | LS} | { EF | LF  } }"];
// 
//     A -> C;
//     B -> C;
// }
// ```

const print_graph = (graph) => {


    let graph_text = `\`\`\`dot\ndigraph structs {\nrankdir=LR;\nnode [shape=record];\n`
        for (var i = 0; i < graph.length; i++) {
        
            const node = graph[i];
            const node_text = `${node.code} [label=" { { ${node.code} | ${node.duration()} } | { ${node.es} | ${node.ls | 'LS'}} | { ${node.ef} | ${node.lf | 'LF'} } } | slack: ${node.lf-node.ef}" ${node.ef === node.lf ? `, style=filled, fillcolor=indianred` : ""} ]; \n`
            graph_text += node_text;
        }
        
        for (var i = 0; i < graph.length; i++) {
            const node = graph[i];
            graph_text += `{${node.precedence.join()}} -> ${node.code} \n`;
        }
        graph_text += "}\n```"
        console.log(graph_text)
    
}



const calculate_pert = (graph) => {

    const move_forward = (graph) => {
        
        for (var i = 0; i < graph.length; i++) {
            const node = graph[i];
            node.precedence_ef = {}
            calc_forward(graph, node)
        }

    }

    const calc_forward = (graph, node) => {

        if (node.code === 'Z') {
            console.log();
        }

        if (!('precedence_ef' in node)) {
            node.precedence_ef = {}
        }
        
        if (node.precedence.length == 0) {
            node.es = 0;
            node.ef = node.es + node.duration();
            return;
        }

        for (var i = 0; i < node.precedence.length; i++) {
            const pre_key = node.precedence[i];
            const pre = graph.filter(a => a.code === pre_key)[0];
            calc_forward(graph, pre);
            
            if ('ef' in pre && pre.ef >= 0) {
                node.precedence_ef[pre_key] = pre.ef; 
                continue;
            }
        }

        if (node.precedence.length === Object.keys(node.precedence_ef).length) {
            node.es = Math.max(...Object.values(node.precedence_ef))
            node.ef = node.es + node.duration()
        }
    }



    const move_backward = (graph, last_node) => {

        last_node.lf = last_node.ef;
        last_node.ls = last_node.lf - last_node.duration()
        // for (var i = 0; i < last_node.length; i++) {
        //     const node_key = last_node.precedence[i];
        //     const node = graph.filter(a => a.code == node_key)[0];
        // }

        for (var i = 0; i < graph.length; i++) {
            const node = graph[i];

            calc_backward(graph, last_node, node);
        }
    }

    const calc_backward = (graph, last_node, node) => {

        if ('lf' in node) {
            return;
        }

        const post_nodes = graph.filter(a => a.precedence.indexOf(node.code) > -1);

        for (var i = 0; i < post_nodes.length; i++) {
            const post_node = post_nodes[i];
            calc_backward(graph, last_node, post_node)
        }

        const post_nodes_ls = post_nodes.filter(a => ('ls' in a)).map(a => a.ls)

        if (post_nodes.length === post_nodes_ls.length) {
            node.lf = Math.min(...post_nodes_ls);
            node.ls = node.lf - node.duration();        
            return;
        }

    }

    move_forward(graph)

    const last_ef = Math.max(...graph.map(a => a.ef));
    const last = graph.filter(a => a.ef === last_ef).sort((a,b) => b.es-a.es)[0];
    
    move_backward(graph, last)
    

}



calculate_pert(graph)

print_graph(graph)






