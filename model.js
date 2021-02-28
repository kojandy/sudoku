class Sudoku {
    constructor(given) {
        this.cells = [];
        this.oncellchange = cell => {};

        for (const form of ["r", "c", "b"]) {
            this[form] = [];
            for (let i = 1; i <= 9; ++i) {
                this[form][i] = [,];
            }
        }

        const itr = given[Symbol.iterator]();
        for (let r = 1; r <= 9; ++r) {
            for (let c = 1; c <= 9; ++c) {
                const cell = new Cell(itr.next().value);
                cell.r = r;
                cell.c = c;
                cell.b = 3 * Math.floor((r - 1) / 3) + Math.floor((c - 1) / 3) + 1;
                cell.onchange = () => this.oncellchange(cell);
                cell.guess = guess => {
                    if (/^[1-9]$/.test(guess) && cell.candidates[guess]) {
                        cell.guessed = guess;
                        cell.candidates.forEach((_, i) => cell.candidates[i] = false);
                        cell.candidates[guess] = true;
                        cell.onchange();
                        cell.peers.forEach(cell => {
                            cell.candidates[guess] = false;
                            cell.onchange();
                        });
                        return true;
                    }
                    return false;
                };
                this.cells.push(cell);
                this.r[r].push(cell);
                this.c[c].push(cell);
                this.b[cell.b].push(cell);
            }
        }

        this.cells.forEach(from => {
            from.peers = [];
            this.cells.forEach(to => {
                if (!(from.r == to.r && from.c == to.c)) {
                    if (from.r == to.r) from.peers.push(to);
                    else if (from.c == to.c) from.peers.push(to);
                    else if (from.b == to.b) from.peers.push(to);
                }
            });
        });

        this.cells.forEach(cell => {
            let rem = cell.peers.map(e => e.given || e.guessed).join("");
            rem = new Cell(rem).toString();
            cell.removeCandidates(rem);
        });
    }

    toString() {
        const cands = [];
        let collen = 0;
        for (let r = 1; r <= 9; ++r) {
            const row = [];
            cands.push(row);
            for (let c = 1; c <= 9; ++c) {
                const str = this.r[r][c].toString();
                if (str.length > collen) collen = str.length;
                row.push(str);
            }
        }

        let str = ".";
        for (let i = 0; i < 3; ++i) str += "".padEnd(collen * 3 + 4, "-") + ".";
        str += "\n";
        let hl = "".padEnd(collen * 3 + 4, "-");
        hl = [hl, hl, hl].join("+");
        hl = ":" + hl + ":\n";
        for (const r in cands) {
            for (const c in cands[r]) {
                if (c % 3 === 0) str += "| ";
                str += cands[r][c].padEnd(collen) + " ";
            }
            str += "|\n";
            if (r == 2 || r == 5) {
                str += hl;
            }
        }
        str += hl.replace(/[:+]/g, " ").trimEnd();
        return str;
    }

    toGivenString() {
        return this.cells.map(e => e.given || "0").join("");
    }
}

class Cell {
    constructor(string) {
        this.onchange = () => {};

        const given = string?.match(/[1-9]/g);
        if (given) {
            if (given.length === 1) this.given = given[0];
            this.candidates = [, false, false, false, false, false, false, false, false, false];
            given.forEach(idx => this.candidates[idx] = true);
        } else {
            this.candidates = [, true, true, true, true, true, true, true, true, true];
        }
    }

    removeCandidates(a) {
        const candidates = a.match(/[1-9]/g);
        if (candidates) {
            candidates.forEach(idx => this.candidates[idx] = false);
            this.onchange();
        }
    }

    toString() {
        return this.candidates.map((e, idx) => {
            if (e === true) return idx;
            else return false;
        }).filter(e => e).join("");
    }
}
