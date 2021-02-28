class Highlighter {
    constructor(view, className) {
        this.cells = [];
        this.className = className;
        this.view = view;
    }

    on(r, c) {
        this.cells.push(this.view.r[r][c]);
        this.view.r[r][c].classList.add(this.className);
    }

    off(r, c) {
        this.cells.splice(this.cells.indexOf(this.view.r[r][c]), 1);
        this.view.r[r][c].classList.remove(this.className);
    }

    is(r, c) {
        return this.cells.includes(this.view.r[r][c]);
    }

    toggle(r, c) {
        if (!this.is(r, c)) this.on(r, c);
        else this.off(r, c);
    }

    reset() {
        this.cells.forEach(cell => cell.classList.remove(this.className));
        this.cells = [];
    }
}

class SudokuView {
    constructor(sudoku) {
        this.oncellclick = e => {};

        this.r = [,];
        for (let r = 1; r <= 9; ++r) {
            const row = [,];
            this.r.push(row);
            for (let c = 1; c <= 9; ++c) {
                const td = document.createElement("td");
                td.onclick = e => {
                    e.r = r;
                    e.c = c;
                    this.oncellclick(e);
                }
                row.push(td);
            }
        }

        this.select = new Highlighter(this, "selected");
        this.highlight = new Highlighter(this, "highlighted");
        Object.defineProperty(this.highlight, "number", (() => {
            let num = undefined;
            return {
                get: () => num,
                set: (v) => {
                    num = v;
                    console.log("setter!");
                },
            }
        })());
        // function(num) {
        //     this.reset();
        //     this.view.model.cells
        //         .filter(cell => !cell.given && !cell.guessed)
        //         .filter(cell => cell.candidates[num])
        //         .forEach(cell => {
        //             this.on(cell.r, cell.c);
        //         });
        // };

        if (sudoku) this.init(sudoku);
    }

    init(sudoku) {
        this.model = sudoku;
        this.model.oncellchange = cell => {
            this.refreshCell(cell.r, cell.c);
        };

        for (let r = 1; r <= 9; ++r) {
            for (let c = 1; c <= 9; ++c) {
                this.r[r][c].model = sudoku.r[r][c];
                this.refreshCell(r, c);
            }
        }
    }

    refreshCell(r, c) {
        const td = this.r[r][c];
        if (this.model.r[r][c].given) {
            td.classList.remove("guessed");
            td.innerHTML = this.model.r[r][c].given;
        } else if (this.model.r[r][c].guessed) {
            td.classList.add("guessed");
            td.innerHTML = this.model.r[r][c].guessed;
        } else {
            td.classList.remove("guessed");
            td.innerHTML = "";
            const div = document.createElement("div");
            div.classList.add("candidate");
            td.appendChild(div);
            for (let i = 1; i <= 9; ++i) {
                const can = document.createElement("div");
                div.appendChild(can);
                if (this.model.r[r][c].candidates[i]) can.innerHTML = i;
            }
        }
    }

    create() {
        const table = document.createElement("table");
        table.classList.add("sudoku");
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        for (let r = 1; r <= 9; ++r) {
            const tr = document.createElement("tr");
            if (r % 3 === 0) tr.classList.add("hl");
            tbody.appendChild(tr);
            for (let c = 1; c <= 9; ++c) {
                const td = this.r[r][c];
                if (c % 3 === 0) td.classList.add("vl");
                tr.appendChild(td);
            }
        }
        return table;
    }
}
