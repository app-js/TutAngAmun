import {FlatTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterOutlet, RouterLink  } from '@angular/router';
import { LoggerService } from '../../logger.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'TopLevel1',
    children: [
      {name: 'Level1a'}, 
      {name: 'Level1b'}, 
      {
        name: 'Level1c',
        children: [
          {name: 'Level2a'}, 
          {
            name: 'Level2b',
            children: [
              {name: 'Level3a'}, 
              {name: 'Level3b'}
            ],
          }
        ],
      }
    ],
  },
  {
    name: 'TopLevel2',
    children: [
      {
        name: 'Level1a',
        children: [{name: 'Level2a'}, {name: 'Level2b'}],
      },
      {
        name: 'Level1b',
        children: [{name: 'Level2a'}, {name: 'Level2b'}],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  standalone: true,
  styleUrl: './tree.component.scss',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, RouterOutlet, RouterLink],
})
export class TreeComponent {
  
  private _transformer = (node: FoodNode, level: number) => {
    this.logger.log('tree _transformer node=' + node.name + ' level=' + level + ' exp: ' + (!!node.children && node.children.length > 0));
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private logger: LoggerService) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    this.logger.log('tree OnInit');
  }

}