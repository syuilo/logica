import autobind from 'autobind-decorator';

import のーど from './node';
import Package from './nodes/package';
import PackageInput from './nodes/package-input';
import PackageOutput from './nodes/package-output';

/**
 * 回路
 */
@autobind
export default class Circuit {
	/**
	 * この回路に含まれているノード
	 */
	public nodes: Set<のーど> = new Set();

	private shouldUpdates: Set<のーど> = new Set();

	private previousStatesList: any[] = [];

	constructor(nodes?: のーど[]) {
		if (nodes) nodes.forEach(n => this.addNode(n));
	}

	/**
	 * 回路の状態を1(またはn)ステップ進めます
	 */
	public tick(n: number = 1) {
		for (let i = 0; i < n; i++) {
			this._tick();
		}
	}

	/**
	 * 回路の状態を1ステップ進めます
	 */
	private _tick() {
		/**********************************************************
		 * ここで各々のノードの状態を更新しますが、各々のノードが入力を
		 * 逐一取得すると、このtick時点での本来の入力とは違った入力状態が
		 * 取得されることになってしまう場合があり(例えばA,Bのノードがあり、
		 * B の入力が A の出力に繋がれているような回路の場合を考えると、
		 * tick開始時点での A の出力が HIGH だとしたらこのtickにおいては
		 * B から見た入力は HIGH として取得されなければなりませんが、
		 * もし A を更新した時に A の出力が LOW になった場合、
		 * 次(といっても同じtick中)に B を更新した時 B が現在の A の
		 * 出力状態を見てしまうので本来なら HIGH が取得されるべきところを
		 * LOW として取得してしまうようなことが起きます。
		 * これは例えると画像のガウスブラーを計算するときと似ていて、
		 * ブラーをかけるとき各々のピクセルについて周囲の(近傍の)ピクセル
		 * の平均の色を適用することになりますが、もしピクセルを参照する時に
		 * 既に処理済みのピクセルを採用してしまうと結果がおかしくなります。
		 * これを防ぐには参照するピクセルを処理前の画像のものにすれば
		 * 良いわけです。それと同じです)、記憶しておいたtick開始前時点での
		 * 入力状態を渡して、それに基づいて自身の状態を更新してもらうようにします。
		 * 記憶しておいた出力状態なら、各々のノードを更新して捌いていく中で
		 * ノードの出力状態が変わってもそれ(記憶)は影響を受けることがありません
		 * ので、どんな順番でtick内の更新すべきノードを捌いていっても結果が
		 * 変わらないようにできます。
		 **********************************************************/

		/**********************************************************
		 1 全てのノードの現在の入力を記憶しておく
		 **********************************************************/

		const inputs = [];

		Array.from(this.shouldUpdates).forEach((node, i) => {
			inputs[i] = {};
			if (node.hasInputPorts) {
				node.inputInfo.forEach(info => {
					inputs[i][info.id] = node.getInput(info.id);
				});
			}
		});

		/**********************************************************
		 2 更新をリクエストされているノードを捌く
		 **********************************************************/

		const updatedNodes = Array.from(this.shouldUpdates)
			.map((node, i) => {
				this.shouldUpdates.delete(node);
				node.update(inputs[i]);
				return node;
			});

		/**********************************************************
		 3 更新したノードが出力を変化させた場合、
		 * そのノードよりひとつあとのノードが影響を受けることになるので、
		 * それらのノードを次回のtickの時に更新するよう記憶しておく
		 **********************************************************/

		updatedNodes.forEach(node => {
			// 出力ポートを持たなかったらスキップ
			if (!node.hasOutputPorts) return;

			const previousStates = this.previousStatesList
				.find(pss => pss.node == node)
				.states;

			node.outputInfo.forEach(o => {
				// 前回の状態
				const previousState = previousStates[o.id];

				// 現在の状態
				const currentState = node.getState(o.id);

				// 前回の状態から変化がなかったら更新は発生させない
				if (currentState === previousState) {
					return;
				} else {
					previousStates[o.id] = currentState;
				}

				// このノードの出力として繋がれている全ての
				// ノードを取得して次回の更新予定リストに登録
				const next = node.getActualNextNodes(o.id);
				next.forEach(n => this.shouldUpdates.add(n));
			});
		});
	}

	/**
	 * 回路の状態の変化がなくなるまでtickします
	 */
	public calc(): number {
		let count = 0;
		while (this.shouldUpdates.size != 0) {
			this.tick();
			count++;
		}
		return count;
	}

	/**
	 * 回路の状態を初期状態に戻します
	 */
	public reset() {
		const dive = node => {
			this.previousStatesList
				.find(pss => pss.node == node)
				.states = {};

			node.init();
			node.emit('state-updated');
			node.emit('input-updated');
			this.scan(node);

			if (node.type === 'Package') {
				(node as Package).nodes.forEach(n => {
					dive(n);
				});
			}
		};

		this.nodes.forEach(n => dive(n));

		this.shouldUpdates.clear();
		this.nodes.forEach(n => this.scan(n));
	}

	public addNode(node: のーど) {
		this.nodes.add(node);
		this.scan(node);
	}

	private scan(node: のーど) {
		node.requestUpdateAtNextTick = () => this.shouldUpdates.add(node);

		this.previousStatesList.push({
			node: node,
			states: {}
		});

		if (node.isForceUpdate) this.shouldUpdates.add(node);

		if (node.type === 'Package') {
			(node as Package).nodes.forEach(n => {
				this.scan(n);
			});
		}
	}

	public removeNode(node: のーど) {
		this.nodes.delete(node);
		node.remove();
	}
}
