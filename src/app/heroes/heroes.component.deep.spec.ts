import { Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component"

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;

  navigateTo: any = null;

  onClick() {
    this.navigateTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService> = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
  let HEROES;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 24},
      {id: 3, name: 'SuperDude', strength: 55},
    ]

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent))

    expect(heroComponentDEs.length).toEqual(3);

    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  })

  it(`should call heroService.deleteHero when the Hero Component's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete');

    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    // 1.
    // heroComponents[1]
    //   .query(By.css('button'))
    //   .triggerEventHandler('click', {
    //     stopPropagation: () => {}
    //   })

    // 2.
    // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

    // 3.
    heroComponents[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  })

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const name = 'Mr. Ice';
    mockHeroService.addHero.and.returnValue(of({ id: 5, name, strength: 4 }));

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', null);

    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigateTo).toBe('/detail/1');
  })
})
