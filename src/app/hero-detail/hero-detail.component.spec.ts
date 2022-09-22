import { Location } from "@angular/common";
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component"

describe('HeroDetailComponent', () => {
  let mockActivatedRoute;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockLocation: jasmine.SpyObj<Location>;

  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => { return '3'; } } }
    }
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 100 }));
  });

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
  });

  it('should call updateHero when save is called', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));

    fixture.detectChanges();

    fixture.componentInstance.save();

    // try
    // setTimeout(() => {
    //   expect(mockHeroService.updateHero).toHaveBeenCalled();
    //   done();
    // }, 300);

    // or
    // tick(250);

    // or
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }))

  // not recommended - only for promises
  // it('should call updateHero when save is called', waitForAsync(() => {
  //   mockHeroService.updateHero.and.returnValue(of({}));

  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   fixture.whenStable().then(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   });

  // }))
})
