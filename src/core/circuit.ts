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
		 * ここで各々のノードを更新しますが、各々のノードが入力を逐一取得すると
		 * このtick時点での本来の入力とは違った入力状態が取得されることになって
		 * しまうので(例えばA,Bのノードがあり、Bの入力がAの出力に繋がれている
		 * 場合を考えると、tick開始時点でのAの出力がHIGHだとしたらこのtick
		 * においてはBの入力はHIGHにならなければなりませんが、もしAを更新した
		 * 時にAの出力がLOWになった場合、次(といっても同じtick中)にBを
		 * 更新した時Bが現在のAの出力状態を見てしまうので本来ならHIGHが取得
		 * されるべきところをLOWとして取得してしまうようなことが起きます。
		 * これは例えると画像のガウスブラーを計算するときと似ていて、ブラーを
		 * かけるとき各々のピクセルについて周囲の(近傍の)ピクセルの平均の色を
		 * 適用することになりますが、もしピクセルを参照する時に既に処理済みの
		 * ピクセルを採用してしまうと結果がおかしくなります。これを防ぐには
		 * 参照するピクセルを処理前の画像のものにすれば良いわけです)、
		 * 1で記憶しておいたtick開始前時点での入力状態を渡して、
		 * それに基づいて自分の状態を更新してもらうようにします。
		 * 記憶しておいた出力状態なら、各々のノードを更新して捌いていく中で
		 * ノードの出力状態が変わってもそれ(記憶)は影響を受けることがありません
		 * ので、どんな順番でtick内の更新すべきノードを捌いていっても結果が
		 * 変わらないようにできます。
		 **********************************************************/

		const updatedNodes = [];

		Array.from(new Set(this.shouldUpdates)).forEach((node, i) => {
			this.shouldUpdates.delete(node);
			node.update(inputs[i]);
			updatedNodes.push(node);
		});

		/**********************************************************
		 3 更新したノードが出力を変化させた場合、
		 * そのノードよりひとつあとのノードが影響を受けることになるので、
		 * それらのノードを次回のtickの時に更新するよう記憶しておく
		 **********************************************************/

		updatedNodes.forEach(node => {
			if (node.hasOutputPorts) {
				node.outputInfo.forEach(o => {
					if ((node as any).hasOwnProperty('_previousStates') && (node as any)._previousStates[o.id] === node.getState(o.id)) return;
					if (!(node as any).hasOwnProperty('_previousStates')) (node as any)._previousStates = {};
					(node as any)._previousStates[o.id] = node.getState(o.id);

					// このノードの出力として繋がれている全ての
					// ノードを取得して次回の更新予定リストに登録
					const next = node.getActualNextNodes(o.id);
					next.forEach(n => this.shouldUpdates.add(n));
				});
			}
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
			delete node._previousStates;
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
